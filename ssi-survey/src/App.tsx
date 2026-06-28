import "./App.css";
import EstimatedTextureDepth from "./EstimatedTextureDepth";
import Header from "./Header";
import RoadSurfaceEvenness from "./RoadSurfaceEvenness";
import { SurveyCalculations } from "./SurveyCalculations";
import { data } from "./data";

const calcs = new SurveyCalculations(data.archive_system_data);
const { etd_nb_plot, etd_sb_plot } = calcs.getETDGraphData();
const metadata = calcs.getMetadata();
const etdMetricData = calcs.getETDMetricData();
const rseMetricData = calcs.getRSEMetricData();
const { rse_nb_plot, rse_sb_plot } = calcs.getRSEGraphData();

function App() {
  return (
    <div className="p-3">
      <Header
        metadata={metadata}
        etdFailingCount={etdMetricData.etdFailingCount}
        rseFailingCount={rseMetricData.rseSpikeCount}
      ></Header>
      <main className="grid grid-cols-2 gap-4 divide-x">
        <EstimatedTextureDepth
          etd_nb_plot={etd_nb_plot}
          etd_sb_plot={etd_sb_plot}
          etd_display_data={etdMetricData}
        ></EstimatedTextureDepth>
        <RoadSurfaceEvenness
          rse_nb_plot={rse_nb_plot}
          rse_sb_plot={rse_sb_plot}
          rse_display_data={rseMetricData}
        ></RoadSurfaceEvenness>
      </main>
    </div>
  );
}

export default App;
