import { comparisonRows } from '@/lib/content';

export function ComparisonTable() {
  return (
    <div className="table-scroll">
      <table className="compare">
        <caption>Deutsche Familienstiftung neben einem Lighthouse Trust mit Wyoming-LLC</caption>
        <thead>
          <tr>
            <th scope="col">Kriterium</th>
            <th scope="col">Deutsche Familienstiftung</th>
            <th scope="col">Trust und Wyoming-LLC</th>
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.criterion}>
              <th scope="row">{row.criterion}</th>
              <td>{row.foundation}</td>
              <td>{row.structure}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
