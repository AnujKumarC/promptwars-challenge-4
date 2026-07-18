import React from "react";
import { render } from "@testing-library/react";
import { PremiumLineChart, PremiumBarChart, PremiumDonutChart } from "../components/analytics/PremiumCharts";

describe("PremiumCharts Components", () => {
  const mockData = [
    { name: "A", value: 10 },
    { name: "B", value: 20 }
  ];

  it("renders animated SVG Line, Bar, and Donut charts without crashing", () => {
    const { container: lineChart } = render(<PremiumLineChart data={mockData} xKey="name" yKey="value" color="#6366f1" />);
    const { container: barChart } = render(<PremiumBarChart data={mockData} xKey="name" yKey="value" color="#10b981" />);
    const { container: donutChart } = render(<PremiumDonutChart data={mockData} color="#ec4899" />);

    expect(lineChart.querySelector("svg")).toBeInTheDocument();
    expect(barChart.querySelector("svg")).toBeInTheDocument();
    expect(donutChart.querySelector("svg")).toBeInTheDocument();
  });
});
