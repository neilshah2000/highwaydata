import type { DataFrame } from "danfojs";
import { useEffect } from "react";
import { RSE_WARN, type RSEMetricData } from "./SurveyCalculations";

type IProps = {
  rse_nb_plot: DataFrame;
  rse_sb_plot: DataFrame;
  rse_display_data: RSEMetricData;
};
function RoadSurfaceEvenness({
  rse_nb_plot,
  rse_sb_plot,
  rse_display_data,
}: IProps) {
  useEffect(() => {
    rse_nb_plot
      .setIndex({ column: "chainage", drop: true })
      .rename({ rse_track_1: "Track 1" })
      .plot("nb_rse_plot_div")
      .line({
        config: { responsive: true } as any,
        layout: {
          title: "Northbound Road Surface Evenness",
          showlegend: true,
          xaxis: { title: "Chainage (m)", rangemode: "tozero" },
          yaxis: { title: "RSE", rangemode: "tozero" },
          shapes: [
            {
              type: "line",
              x0: 0,
              x1: 1,
              xref: "paper",
              y0: RSE_WARN,
              y1: RSE_WARN,
              line: { color: "red", width: 1.5, dash: "dash" },
            },
          ],
          annotations: [
            {
              x: 0.75,
              xref: "paper",
              y: RSE_WARN,
              yref: "y",
              text: `Advisory threshold (${RSE_WARN})`,
              showarrow: false,
              xanchor: "right",
            },
          ],
        },
      });
  }, []);

  useEffect(() => {
    rse_sb_plot
      .setIndex({ column: "chainage", drop: true })
      .rename({ rse_track_1: "Track 1" })
      .plot("sb_rse_plot_div")
      .line({
        config: { responsive: true } as any,
        layout: {
          title: "Southbound Road Surface Evenness",
          showlegend: true,
          xaxis: { title: "Chainage (m)", rangemode: "tozero" },
          yaxis: { title: "RSE", rangemode: "tozero" },
          shapes: [
            {
              type: "line",
              x0: 0,
              x1: 1,
              xref: "paper",
              y0: RSE_WARN,
              y1: RSE_WARN,
              line: { color: "red", width: 1.5, dash: "dash" },
            },
          ],
          annotations: [
            {
              x: 0.75,
              xref: "paper",
              y: RSE_WARN,
              yref: "y",
              text: `Advisory threshold (${RSE_WARN})`,
              showarrow: false,
              xanchor: "right",
            },
          ],
        },
      });
  }, []);
  const top10 = rse_display_data.rseSpikes.head(10);
  console.log({ cols: top10.columns, rows: top10.values });
  return (
    <>
      <div>
        <h3 className="text-lg mb-2 underline">Road Surface Evenness (RSE)</h3>
        <div>Northbound mean : {rse_display_data.rseNbMean.toFixed(4)}</div>
        <div>Southbound mean : {rse_display_data.rseSbMean.toFixed(4)}</div>
        <div>Spike locations (&gt;3σ): {rse_display_data.rseSpikeCount}</div>
        <div>
          RSE Spike Report (threshold = mean + 3σ = ) :{" "}
          {(rse_display_data.rseMean + 3 * rse_display_data.rseStd).toFixed(4)}
        </div>

        <table className="mt-5">
          <caption>Top 10 worst RSE locations</caption>
          <thead>
            <tr>
              {top10.columns.map((col) => (
                <th scope="col" key={col} className="px-2 py-1 border">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top10.values.map((row: any, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-2 py-1 border">{row[0]}</td>
                <td className="px-2 py-1 border">{row[1]}</td>
                <td className="px-2 py-1 border">{row[2].toFixed(3)}</td>
                <td className="px-2 py-1 border">{row[3]}</td>
                <td className="px-2 py-1 border">{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div id="nb_rse_plot_div"></div>
        <div id="sb_rse_plot_div"></div>
      </div>
    </>
  );
}

export default RoadSurfaceEvenness;
