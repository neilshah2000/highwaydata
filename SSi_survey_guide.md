# SSi Survey Analysis — Reader's Guide

**Road:** A6 Buxton Road, Stockport | **Surveyed:** 29 April 2026 | **Surface laid:** 14 April 2026

This guide explains each section of the Jupyter notebook: what is being calculated, what the output means, and why it matters.

---

## Background: What is being measured?

Two measurements are recorded at 10-metre intervals along roughly 1km of road, in both the Northbound (NB) and Southbound (SB) directions:

- **ETD — Estimated Texture Depth (mm).** How rough the road surface is at a microscopic level. Rougher surfaces grip tyres better, especially in wet conditions. Measured on tracks 3 and 4 (the wheel paths).
- **RSE — Road Surface Evenness.** How smooth or wavy the road is at a larger scale — think of it as detecting bumps and dips. Low values are good; spikes indicate surface irregularities. Measured on track 1.

The other fields (MPD, UKRI, IRI, RMS) are empty in this dataset — they represent measurements that were either not taken or not yet uploaded.

---

## Section 1 — Load & Inspect Data

**What it does:** Reads the raw JSON file and converts it into a table. Prints basic facts: total record count, survey types present, chainage (distance) range, and the time the survey was conducted.

**Why it matters:** Confirms the data loaded correctly and gives a quick sanity check — right road, right date, expected number of records.

---

## Section 2 — Split Subsets

**What it does:** Divides the 2,042 records into four groups for easier analysis: ETD Northbound, ETD Southbound, RSE Northbound, RSE Southbound.

**Why it matters:** ETD and RSE are collected by different equipment passes and have completely different numeric scales, so they must be analysed separately. NB and SB are physically different lane surfaces and may perform differently.

---

## Section 3 — Descriptive Statistics

**What it does:** Calculates standard summary statistics for each metric and track:

| Statistic | Meaning |
|-----------|---------|
| **count** | Number of valid readings (non-null) |
| **mean** | Average value across the route |
| **std** | Standard deviation — how spread out the readings are |
| **min / max** | Lowest and highest recorded value |
| **25% / 50% / 75%** | The value below which 25%, 50%, 75% of readings fall |

**Why it matters:** A high standard deviation relative to the mean suggests inconsistency along the route — some areas are performing very differently from others.

---

## Section 4 — ETD Longitudinal Profile

**What it does:** Plots ETD values (y-axis) against distance along the road in metres (x-axis) for each carriageway. Both tracks are shown on the same chart. A red dashed line marks the **0.7mm minimum threshold**. Any sections below the threshold are shaded red.

**Where does 0.7mm come from?**
The UK road surface skid resistance specification (referenced in standards such as HD 28 and the Well-Managed Highway Infrastructure Code of Practice) sets 0.7mm as the minimum acceptable texture depth for roads open to traffic. Below this level, wet-road grip is considered inadequate and the surface requires investigation or remedial action. Note: freshly laid surfaces (as here, just two weeks old) are expected to comfortably exceed this.

**Why it matters:** This is the primary compliance chart — it shows at a glance whether any part of the road falls below the legal minimum, and where along the route texture depth is lowest.

---

## Section 5 — RSE Longitudinal Profile

**What it does:** Plots RSE values along the route. Two lines are shown:
- **Grey line (raw):** Every individual reading.
- **Blue line (rolling mean):** A smoothed average calculated over the nearest 5 readings (covering a 50m window). This removes single-point noise and reveals the underlying trend.

A red dashed line marks an **advisory threshold of 1.0**.

**Where does 1.0 come from?**
Unlike ETD, there is no single universal RSE pass/fail figure — it depends on road classification and the specific survey equipment used. The value of 1.0 used here is an advisory marker for visual reference; your organisation's contract specification or the equipment manufacturer's guidance should be consulted for the applicable threshold for this road type.

**Why it matters:** Persistent elevated RSE over a stretch of road suggests a waviness or unevenness problem with the surface layer — potentially caused by poor compaction during laying, underlying base movement, or material inconsistency.

---

## Section 6 — NB vs SB Comparison

**What it does:** Produces box-and-whisker plots comparing the distribution of readings between the two carriageways.

**How to read a box plot:**
- The **box** spans the middle 50% of readings (25th to 75th percentile).
- The **line inside the box** is the median (middle value).
- The **whiskers** extend to the minimum and maximum, excluding outliers.
- **Dots beyond the whiskers** are statistical outliers — unusually high or low readings.

**Why it matters:** If NB and SB boxes look very different, it suggests the two carriageways are behaving differently — one may have been laid or compacted differently, or may have had more traffic loading since opening.

---

## Section 7 — ETD Track 3 vs Track 4 Correlation

**What it does:** Plots each section's Track 3 reading against its Track 4 reading as a scatter chart. A dashed line shows where the two tracks would be perfectly equal. The **Pearson correlation coefficient (r)** is printed on the chart.

**How to interpret r:**
- **r = 1.0** → the two tracks move in perfect lockstep
- **r = 0.7–1.0** → strong agreement
- **r below 0.5** → the tracks are behaving independently — inconsistent surface

**Why it matters:** The two tracks correspond to the left and right wheel paths of a lane. If their texture depths are well-correlated, the surface was laid evenly across its width. A low correlation may indicate issues with the laying pass width or mix consistency.

---

## Section 8 — Compliance Report (ETD Threshold Failures)

**What it does:** Filters the dataset to find every reading where either Track 3 or Track 4 falls below 0.7mm. Prints a table of the failing chainages, their exact readings, and which carriageway they are on.

**Output summary line:**
- `Failing readings: X / Y (Z%)` — the number and proportion of measurement points that do not meet the minimum texture depth requirement.
- `Overall compliance: PASS / INVESTIGATE` — a simple flag based on whether any failures exist.

**Why it matters:** This is the formal deliverable in most post-laying surveys. Any failures in this table require investigation, retesting, or remedial surfacing before the road is signed off.

---

## Section 9 — RSE Spike Detection

**What it does:** Identifies locations where RSE is abnormally high. The threshold is calculated statistically:

> **Spike threshold = mean + 3 × standard deviation (3σ)**

In a normally distributed dataset, only 0.3% of readings should exceed the mean by more than 3 standard deviations. Readings beyond this level are flagged as genuine outliers rather than random variation. The top 10 worst locations are printed with their chainage and GPS coordinates.

**Why it matters:** RSE spikes at specific chainages point to discrete surface defects — a bump, a hollow, or a poorly-formed joint. Unlike a general roughness trend, a spike is localised and often actionable: the coordinates allow it to be physically inspected on site.

---

## Section 10 — Distribution Histograms

**What it does:** Shows the shape of the data as frequency charts — how many readings fell into each value band. The RSE histogram uses a logarithmic y-axis because the vast majority of readings cluster near zero, making the rare spikes hard to see on a linear scale.

**Why it matters:** A healthy new road surface should show a tight, roughly bell-shaped distribution centred well above the minimum threshold. A wide spread, or a tail extending toward the threshold, is an early warning of surface inconsistency even if no individual point has yet failed.

---

## Section 11 — Spatial Map

**What it does:** Renders every measurement as a coloured dot on an interactive street map (open `survey_map.html` in a browser). 

**Colour coding:**
- **RSE dots (small):** Green = low (good), Orange = medium, Red = high (potential defect)
- **ETD dots (larger):** Blue = PASS (≥0.7mm), Red = FAIL (<0.7mm)

Click any dot to see its exact RSE or ETD reading and chainage.

**Why it matters:** Charts show what is happening; a map shows *where*. Spatial clustering of red dots may reveal a specific section of road that needs attention, or confirm that readings are uniformly good along the full length.

---

## Section 12 — Executive Summary

**What it does:** Prints a concise text summary pulling together the key numbers from all previous sections:

- Mean ETD for each track
- Number and percentage of ETD compliance failures
- Mean RSE for NB and SB
- Count of RSE spike locations
- A plain-English assessment line for each metric

**Why it matters:** Designed to be copy-pasted into a site report or email. All values are derived from the analysis above — no manual calculation required.

---

## Key thresholds at a glance

| Metric | Threshold | Source |
|--------|-----------|--------|
| ETD minimum | **0.7 mm** | UK skid resistance standards (HD 28 / Well-Managed Highway Infrastructure CoP) |
| RSE advisory | **1.0** | Advisory marker — check contract specification for road-type-specific value |
| RSE spike detection | **mean + 3σ** | Statistical outlier convention (flags top ~0.3% of readings) |
