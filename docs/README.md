---
layout: home
permalink: index.html

# Please update this with your repository name and project title
repository-name: e21-3yp-RAID
title: RAID
---

[comment]: # "This is the standard layout for the project, but you can clean this and use your own template"

# Autonomous IoT-Based Railway Track Crack Detection Robot

---

## Team
-  E21/096,Chamodi Dikela,e21096@eng.pdn.ac.lk
-  E/21/127,Navoda Erandi,e21127@eng.pdn.ac.lk
-  E/21/140,Suvini Fonseka,e21140@eng.pdn.ac.lk
-  E/21/363,Tharushi Savindi,e21363@eng.pdn.ac.lk

<!-- Image (photo/drawing of the final hardware) should be here -->

<!-- This is a sample image, to show how to add images to your page. To learn more options, please refer [this](https://projects.ce.pdn.ac.lk/docs/faq/how-to-add-an-image/) -->

<!-- ![Sample Image](./images/sample.png) -->

#### Table of Contents
1. [Introduction](#introduction)
2. [Solution Architecture](#solution-architecture )
3. [Hardware & Software Designs](#hardware-and-software-designs)
4. [Testing](#testing)
5. [Detailed budget](#detailed-budget)
6. [Conclusion](#conclusion)
7. [Links](#links)

## Introduction

### Real-World Problem

Railway track failures caused by cracks, wear, and structural defects are a major reason for train derailments and service disruptions worldwide. Traditional inspection methods rely heavily on manual patrols and scheduled checks, which are time-consuming, expensive, and expose workers to dangerous environments. These methods often fail to detect small or early-stage cracks, allowing defects to worsen over time and increasing the risk of accidents.

Additionally, the lack of real-time monitoring and precise location tracking makes it difficult for maintenance teams to respond quickly and efficiently when issues are detected.

---

###  Proposed Solution

This project introduces an **autonomous IoT-based railway track crack detection robot** that continuously monitors railway tracks in real time. The robot uses a combination of **IR sensors** and **ultrasonic sensors** to detect cracks and surface irregularities with high accuracy.

When a defect is detected:

1. An onboard camera captures clear images of the affected track section  
2. GPS data is recorded to identify the exact location of the defect  
3. All data is instantly uploaded to a cloud platform, where alerts are displayed on a monitoring dashboard  

This enables railway authorities to identify issues early, prioritize maintenance tasks, and respond without sending personnel into hazardous areas.

---

###  Impact and Benefits

- **Improved Safety:** Early crack detection significantly reduces the risk of derailments and accidents  
- **Reduced Human Risk:** Minimizes the need for manual track inspections in dangerous environments  
- **Real-Time Monitoring:** Enables immediate alerts and faster decision-making  
- **Cost-Effective Maintenance:** Prevents minor defects from developing into major infrastructure failures  
- **Scalable Solution:** Can be deployed across large railway networks and integrated with existing maintenance systems  

By leveraging **automation, IoT connectivity, and cloud analytics**, this system contributes to **safer, smarter, and more efficient railway infrastructure management**.

## Solution Architecture

High level diagram + description

## Hardware and Software Designs

Detailed designs with many sub-sections

## Testing

Testing done on hardware and software, detailed + summarized results

## Detailed budget

All items and costs

## All Items and Costs

| Item                                                                 | Quantity | Unit Cost (LKR) | Total (LKR) |
|----------------------------------------------------------------------|:--------:|:---------------:|:-----------:|
| ESP32 Development Board - WROOM                                      | 1        | 1340            | 1340        |
| ESP32-CAM Module                                                     | 1        | 2190            | 2190        |
| Ultrasonic Sensors (HC-SR04)                                         | 2        | 230             | 460         |
| DC Geared Motors (TT / BO Motors, 100–200 RPM)                       | 4        | 1290            | 5160        |
| Motor Driver Module (L298N / L293D)                                  | 1        | 440             | 440         |
| GPS Module (NEO-6M / NEO-7M)                                         | 1        | 2590            | 2590        |
| Rechargeable Battery                                                 | 1        | 1377            | 1377        |
| Buck Converter (DC-DC Step-Down Module)                              | 1        | 1275            | 1275        |
| PCB / Perfboard (for prototyping or final soldering)                 | 1        | 1000            | 1000        |
| Switch / Power Button                                                | 1        | 85              | 85          |
| Buzzer (Audible alert)                                               | 1        | 500             | 500         |
| 16x2 LCD Display with I2C Module                                     | 1        | 1200            | 1200        |
| Micro SD Card Module                                                 | 1        | 330             | 330         |
| Other miscellaneous components (wires, mounts, fasteners, etc.)      | –        | –               | 3000        |
| **Total Estimated Cost**                                             |          |                 | **22797**   |



## Conclusion

What was achieved, future developments, commercialization plans

## Links

- [Project Repository](https://github.com/cepdnaclk/{{ page.repository-name }}){:target="_blank"}
- [Project Page](https://cepdnaclk.github.io/{{ page.repository-name}}){:target="_blank"}
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)

[//]: # (Please refer this to learn more about Markdown syntax)
[//]: # (https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
