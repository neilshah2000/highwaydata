import type { DataFrame } from "danfojs";
import { useEffect } from "react";
import { ETD_MIN, type ETDMetricData } from "./SurveyCalculations";

type IProps = {
  etd_nb_plot: DataFrame;
  etd_sb_plot: DataFrame;
  etd_display_data: ETDMetricData;
};
function EstimatedTextureDepth({
  etd_nb_plot,
  etd_sb_plot,
  etd_display_data,
}: IProps) {
  useEffect(() => {
    etd_nb_plot
      .setIndex({ column: "chainage", drop: true })
      .rename({ etd_track_3: "Track 3", etd_track_4: "Track 4" })
      .plot("nb_etd_plot_div")
      .line({
        config: { responsive: true } as any,
        layout: {
          title: "Northbound Estimated Texture Depth",
          xaxis: { title: "Chainage (m)", rangemode: "tozero" },
          yaxis: { title: "ETD (mm)", rangemode: "tozero" },
          shapes: [
            {
              type: "line",
              x0: 0,
              x1: 1,
              xref: "paper",
              y0: ETD_MIN,
              y1: ETD_MIN,
              line: { color: "red", width: 1.5, dash: "dash" },
            },
          ],
          annotations: [
            {
              x: 1,
              xref: "paper",
              y: ETD_MIN,
              yref: "y",
              text: `Min threshold (${ETD_MIN} mm)`,
              showarrow: false,
              xanchor: "right",
            },
          ],
        },
      });
  }, []);

  useEffect(() => {
    etd_sb_plot
      .setIndex({ column: "chainage", drop: true })
      .rename({ etd_track_3: "Track 3", etd_track_4: "Track 4" })
      .plot("sb_etd_plot_div")
      .line({
        config: { responsive: true } as any,
        layout: {
          title: "Southbound Estimated Texture Depth",
          xaxis: { title: "Chainage (m)", rangemode: "tozero" },
          yaxis: { title: "ETD (mm)", rangemode: "tozero" },
          shapes: [
            {
              type: "line",
              x0: 0,
              x1: 1,
              xref: "paper",
              y0: ETD_MIN,
              y1: ETD_MIN,
              line: { color: "red", width: 1.5, dash: "dash" },
            },
          ],
          annotations: [
            {
              x: 1,
              xref: "paper",
              y: ETD_MIN,
              yref: "y",
              text: `Min threshold (${ETD_MIN} mm)`,
              showarrow: false,
              xanchor: "right",
            },
          ],
        },
      });
  }, []);
  const failPercent = (
    (100 * etd_display_data.etdFailingCount) /
    etd_display_data.etdTotalCount
  ).toFixed(1);
  const passPercent = (100 - parseFloat(failPercent)).toFixed(1);
  return (
    <>
      <div>
        <h3 className="text-lg mb-2 underline">
          Estimated Texture Depth (ETD)
        </h3>
        <div>Mean Track 3 : {etd_display_data.etdMeanTrack3.toFixed(3)} mm</div>
        <div>Mean Track 4 : {etd_display_data.etdMeanTrack4.toFixed(3)} mm</div>
        <div>Total ETD readings : {etd_display_data.etdTotalCount}</div>
        <div>
          Sections failing 0.7mm threshold: {etd_display_data.etdFailingCount}/
          {etd_display_data.etdTotalCount} ({failPercent}%)
        </div>
        <div>Pass rate : {passPercent}%</div>

        <table className="mt-5">
          <caption>ETD Compliance Summary (threshold = 0.7 mm)</caption>
          <thead>
            <tr>
              {etd_display_data.etdFailingData.columns.map((col) => (
                <th scope="col" key={col} className="px-2 py-1 border">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {etd_display_data.etdFailingData.values.map(
              (row: any, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="px-2 py-1 border">{row[0]}</td>
                  <td className="px-2 py-1 border">{row[1]}</td>
                  <td className="px-2 py-1 border">{row[2]}</td>
                  <td className="px-2 py-1 border">{row[3]}</td>
                  <td className="px-2 py-1 border">{row[4]}</td>
                  <td className="px-2 py-1 border">{row[5]}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>

        <div id="nb_etd_plot_div"></div>
        <div id="sb_etd_plot_div"></div>
      </div>
    </>
  );
}

export default EstimatedTextureDepth;
