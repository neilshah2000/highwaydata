import type { SurveyMetadata } from "./SurveyCalculations";

type IProps = {
  metadata: SurveyMetadata;
  etdFailingCount: number;
  rseFailingCount: number;
};
function Header({ metadata, etdFailingCount, rseFailingCount }: IProps) {
  const address = metadata.locations.join(", ");
  const mdDiaplay = [
    { title: "Surfaces", value: metadata.surfaces.join(", ") },
    { title: "Total records", value: metadata.totalRecords },
    { title: "Survey types", value: metadata.surveyTypes.join(", ") },
    { title: "Carriageways", value: metadata.carriageways.join(", ") },
    {
      title: "Chainage range",
      value: `${metadata.chainageMin}m – ${metadata.chainageMax}m`,
    },
    {
      title: "Survey time",
      value: `${metadata.timeMin.toString().split(" GMT")[0]} → ${metadata.timeMax.toString().split(" GMT")[0]}`,
    },
  ];

  let etdVerdict = "";
  if (etdFailingCount === 0) {
    etdVerdict = "PASS";
  } else if (etdFailingCount > 0 && etdFailingCount < 10) {
    etdVerdict = "INVESTIGATE";
  } else {
    etdVerdict = "FAIL";
  }

  let rseVerdict = "";
  if (rseFailingCount === 0) {
    rseVerdict = "EXCELLENT";
  } else if (rseFailingCount > 0 && rseFailingCount < 10) {
    rseVerdict = "GOOD";
  } else {
    rseVerdict = "POOR";
  }

  const etdStatusClass = {
    PASS: "text-green-600",
    FAIL: "text-red-600",
    INVESTIGATE: "text-yellow-500",
  }[etdVerdict];

  const rseStatusClass = {
    EXCELLENT: "text-green-600",
    GOOD: "text-yellow-500",
    POOR: "text-red-600",
  }[rseVerdict];
  return (
    <header className="border-b border-gray-300 mb-2 pb-2">
      <div className="flex justify-between font-bold text-xl mb-2">
        <h1>{address}</h1>
        <h3>
          Survey:{" "}
          {metadata.timeMin.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </h3>
      </div>
      <div className="flex justify-between">
        <div>
          {mdDiaplay.map((md) => (
            <div className="flex gap-2" key={md.title}>
              <div className="font-bold">{md.title}</div>
              <div>{md.value}</div>
            </div>
          ))}
        </div>
        <div>
          <div className={`font-bold ${etdStatusClass}`}>
            <div>Estimated Texture Depth Verdict: {etdVerdict}</div>
            <div>({etdFailingCount} failing section)</div>
          </div>
          <div className={`font-bold ${rseStatusClass}`}>
            <div>Road Surface Evenness Verdict: {rseVerdict}</div>
            <div>({rseFailingCount} failing sections)</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
