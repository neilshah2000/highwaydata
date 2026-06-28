import { DataFrame } from "danfojs";

export const ETD_MIN = 0.7;
export const RSE_WARN = 1.0;

export class SurveyCalculations {
  private readonly df: DataFrame; // full data
  private readonly etd: DataFrame;
  private readonly rse: DataFrame;
  private readonly rse_nb: DataFrame;
  private readonly rse_sb: DataFrame;
  private readonly etd_nb: DataFrame;
  private readonly etd_sb: DataFrame;

  constructor(data: SurveyPoint[]) {
    const allData = new DataFrame(data);
    const cols = allData.columns;
    const colsToDrop = cols.filter((col) =>
      allData[col].values.every(
        (v: unknown) => v === null || v === undefined || Number.isNaN(v),
      ),
    );
    this.df = allData.drop({ columns: colsToDrop });
    this.etd = this.filterDataFrame(this.df, "survey_type", "ETD");
    this.rse = this.filterDataFrame(this.df, "survey_type", "RSE");

    this.rse_nb = this.filterDataFrame(this.rse, "carriageway", "NB");
    this.rse_sb = this.filterDataFrame(this.rse, "carriageway", "SB");
    this.etd_nb = this.filterDataFrame(this.etd, "carriageway", "NB");
    this.etd_sb = this.filterDataFrame(this.etd, "carriageway", "SB");
  }

  getMetadata(): SurveyMetadata {
    const timestamps = this.df["timestamp"].values;
    const minDate = timestamps.reduce((a: any, b: any) => (a < b ? a : b));
    const maxDate = timestamps.reduce((a: any, b: any) => (a > b ? a : b));

    return {
      locations: this.df["job_description"].unique().values,
      surfaces: this.df["surface_description"].unique().values,
      totalRecords: this.df.shape[0],
      surveyTypes: this.df["survey_type"].unique().values,
      carriageways: this.df["carriageway"].unique().values,
      chainageMin: this.df["chainage"].min(),
      chainageMax: this.df["chainage"].max(),
      timeMin: new Date(minDate),
      timeMax: new Date(maxDate),
    };
  }

  getETDMetricData(): ETDMetricData {
    const mask = this.etd["etd_track_3"].lt(ETD_MIN);
    let filtered = this.etd.loc({ rows: mask });
    filtered = filtered.loc({
      columns: [
        "id",
        "section",
        "chainage",
        "survey_type",
        "etd_track_3",
        "etd_track_4",
      ],
    });
    return {
      etdTotalCount: this.etd.shape[0],
      etdFailingCount: filtered.shape[0],
      etdMeanTrack3: this.etd["etd_track_3"].mean(),
      etdMeanTrack4: this.etd["etd_track_4"].mean(),
      etdFailingData: filtered,
    };
  }

  // data for EDT graph
  getETDGraphData(): { etd_nb_plot: DataFrame; etd_sb_plot: DataFrame } {
    const etd_nb_plot = this.etd_nb.loc({
      columns: ["chainage", "etd_track_3", "etd_track_4"],
    });
    const etd_sb_plot = this.etd_sb.loc({
      columns: ["chainage", "etd_track_3", "etd_track_4"],
    });
    return { etd_nb_plot, etd_sb_plot };
  }

  getRSEMetricData(): RSEMetricData {
    const rse_mean_nb = this.rse_nb["rse_track_1"].mean();
    const rse_mean_sb = this.rse_sb["rse_track_1"].mean();
    const rse_mean = this.rse["rse_track_1"].mean();
    const rse_std = this.rse["rse_track_1"].std();
    const spike_threshold = rse_mean + 3 * rse_std;

    // spikes = rse[rse['rse_track_1'] > spike_threshold].copy()
    let spikes = this.rse
      .query(this.rse["rse_track_1"].gt(spike_threshold))
      .resetIndex();
    spikes = spikes.loc({
      columns: [
        "carriageway",
        "chainage",
        "rse_track_1",
        "latitude",
        "longitude",
      ],
    });
    const top10 = spikes.sortValues("rse_track_1", { ascending: false });

    return {
      rseSpikeCount: spikes.shape[0],
      rseMean: rse_mean,
      rseNbMean: rse_mean_nb,
      rseSbMean: rse_mean_sb,
      rseStd: rse_std,
      rseSpikes: top10,
    };
  }

  // data for RSE graph
  getRSEGraphData(): { rse_nb_plot: DataFrame; rse_sb_plot: DataFrame } {
    const rse_nb_plot = this.rse_nb.loc({
      columns: ["chainage", "rse_track_1"],
    });
    const rse_sb_plot = this.rse_sb.loc({
      columns: ["chainage", "rse_track_1"],
    });
    return { rse_nb_plot, rse_sb_plot };
  }

  // string filter. catagorical data only
  private filterDataFrame = (
    df: DataFrame,
    field: string,
    value: string,
  ): DataFrame => {
    const filteredDataFrame = df.query(df[field].eq(value)).resetIndex();
    return filteredDataFrame;
  };
}

export interface SurveyPoint {
  id: number;
  section: number;
  chainage: number;
  survey_type: string;
  latitude: number;
  longitude: number;
  location: string;
  elevation: number | null;
  timestamp: string;
  job_no: string;
  job_description: string;
  carriageway: string;
  direction: string;
  surface_description: string;
  date_laid: string;
  engineer: string;
  client_id: number;
  notes: string | null;
  created_timestamp: string;
}

export type RawSurveyPoint = SurveyPoint & Record<string, unknown>;

interface ETD extends SurveyPoint {
  etd_track_3: number;
  etd_track_4: number;
}

interface RSE extends SurveyPoint {
  rse_track_1: number;
}

export type SurveyMetadata = {
  locations: string[];
  surfaces: string[];
  totalRecords: number;
  surveyTypes: string[];
  carriageways: string[];
  chainageMin: number;
  chainageMax: number;
  timeMin: Date;
  timeMax: Date;
};

export type RSEMetricData = {
  rseSpikeCount: number;
  rseMean: number;
  rseNbMean: number;
  rseSbMean: number;
  rseStd: number;
  rseSpikes: DataFrame;
};

export type ETDMetricData = {
  etdTotalCount: number;
  etdFailingCount: number;
  etdMeanTrack3: number;
  etdMeanTrack4: number;
  etdFailingData: DataFrame;
};
