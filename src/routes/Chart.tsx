import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { chdir } from "process";
import { darkTheme, lightTheme } from "../theme";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}
interface ChartProps {
  coinId: string;
}

function Chart({ coinId }: ChartProps) {
  const isDark = useRecoilValue(isDarkAtom);

  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 5000,
    }
  );
  return (
    <div>
      {isLoading ? (
        "Loading"
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "price",
              data: data?.map((price) => price.close),
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },

            chart: {
              width: 500,
              height: 500,
              background: "transparent",
              toolbar: {
                show: false,
              },
            },
            grid: {
              show: false,
            },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              axisTicks: { show: false },
              axisBorder: { show: false },
              type: "datetime",
              categories: data?.map((price) => price.time_close),
              labels: {
                show: false,
              },
            },
            fill: {
              type: "gradient",
              gradient: {
                gradientToColors: [isDark ? "white" : "#97e8dd"],
                stops: [0, 100],
              },
            },
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
