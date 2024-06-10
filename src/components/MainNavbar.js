import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import { signOutAccount } from "../services/firebase";
import { useUser } from "../contexts/UserContext";
import { deleteNotificationByIndex } from "../services/persistence/user";
import {
  Button,
  Navbar,
  Popover,
  List,
  ListItem,
  Panel,
  Page,
} from "konsta/react";
import { Link } from "react-router-dom";

const MainNavbar = () => {
  const { userDetails, notifications, deleteNotification } = useUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const popoverRef = useRef(null);

  function handleNotificationDelete(index) {
    deleteNotification(index);
  }

  return (
    <>
      <Navbar
        left={
          <a href={"/"} className="btn btn-circle btn-ghost text-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className=" h-12 w-12 text-primary"
              viewBox="0 0 1121 936"
            >
              <g>
                <path
                  d="M 550.91,901.58 C550.67,901.34 545.76,900.90 539.99,900.60 C481.71,897.52 420.44,881.41 366.50,854.99 C302.82,823.79 255.15,786.67 215.06,737.05 C184.18,698.83 157.67,651.73 142.43,608.00 C138.11,595.58 132.00,573.67 132.00,570.56 C132.00,569.22 131.60,567.87 131.11,567.57 C130.62,567.27 129.98,565.55 129.68,563.76 C129.39,561.97 128.66,558.48 128.07,556.00 C125.81,546.53 122.58,527.64 120.98,514.50 C114.23,459.13 116.93,397.93 128.09,353.50 C128.64,351.30 129.48,347.93 129.95,346.00 C137.15,316.51 146.68,291.83 164.64,256.15 C197.10,191.66 246.44,136.39 310.50,92.77 C344.00,69.97 371.79,55.68 409.00,42.14 C421.71,37.52 427.29,35.73 448.00,29.62 C458.12,26.63 474.96,22.62 484.00,21.04 C487.57,20.42 492.75,19.50 495.50,19.00 C530.43,12.62 575.57,11.30 616.00,15.48 C623.03,16.20 651.09,21.35 666.00,24.64 C723.23,37.28 787.04,65.34 833.37,98.24 C873.68,126.86 903.72,157.31 936.71,203.00 C958.14,232.67 979.24,275.63 992.94,317.50 C1005.65,356.32 1009.64,374.77 1013.02,410.44 C1015.92,441.10 1015.76,476.31 1012.56,507.50 C1009.87,533.86 1000.51,576.98 992.61,599.50 C983.24,626.22 975.13,645.85 965.86,664.31 C962.27,671.45 946.19,698.77 938.68,710.50 C917.55,743.48 882.52,781.52 847.50,809.52 C813.30,836.88 765.71,862.45 722.00,876.97 C678.46,891.43 634.56,899.17 585.50,901.03 C558.67,902.05 551.49,902.16 550.91,901.58 M 508.00,824.46 C514.19,823.06 523.15,820.40 527.89,818.54 C536.71,815.10 554.39,806.24 559.15,802.87 C560.61,801.84 562.07,801.00 562.39,801.00 C563.30,801.00 572.92,795.00 579.16,790.54 C582.27,788.32 585.64,785.94 586.66,785.26 C587.67,784.58 592.33,781.34 597.00,778.05 C601.67,774.77 609.20,769.76 613.73,766.92 C618.25,764.08 622.47,761.14 623.10,760.38 C623.73,759.62 624.86,759.00 625.61,759.00 C626.37,759.00 627.55,758.10 628.23,757.00 C628.92,755.90 629.85,755.00 630.31,755.00 C631.25,755.00 639.36,749.54 642.56,746.76 C645.50,744.20 658.80,736.00 660.01,736.00 C660.55,736.00 661.00,735.54 661.00,734.98 C661.00,734.42 662.69,733.19 664.75,732.23 C666.81,731.28 669.32,729.49 670.32,728.25 C671.32,727.01 672.63,726.00 673.21,726.00 C673.80,726.00 674.81,725.28 675.45,724.40 C676.11,723.50 678.68,722.56 681.31,722.27 C684.14,721.95 686.00,721.24 686.00,720.48 C686.00,718.16 689.23,717.87 691.47,719.97 C694.02,722.37 696.00,722.60 696.00,720.50 C696.00,718.35 697.56,718.65 700.22,721.31 C702.10,723.19 702.46,724.47 702.19,728.24 C701.73,734.60 703.19,737.00 707.54,737.00 C709.95,737.00 711.00,736.54 711.00,735.50 C711.00,734.67 711.89,734.00 713.00,734.00 C714.61,734.00 715.00,734.67 715.00,737.42 C715.00,739.30 714.49,741.00 713.86,741.21 C713.01,741.50 713.02,742.17 713.90,743.82 C714.72,745.34 715.55,745.79 716.53,745.24 C719.01,743.85 725.53,745.02 726.82,747.09 C727.87,748.76 727.73,749.00 725.76,749.02 C724.04,749.03 723.84,749.25 724.91,749.92 C726.52,750.94 730.00,749.19 730.00,747.37 C730.00,746.73 731.11,745.94 732.47,745.60 C733.83,745.26 735.42,744.08 736.01,742.99 C736.63,741.83 738.10,741.00 739.54,741.00 C740.89,741.00 742.00,740.63 742.00,740.17 C742.00,739.71 743.23,738.70 744.74,737.92 C747.67,736.40 750.19,734.55 753.15,731.75 C754.17,730.79 755.38,730.00 755.85,730.00 C756.31,730.00 757.50,729.10 758.50,728.00 C759.50,726.90 760.75,726.00 761.28,726.00 C761.82,726.00 765.56,723.75 769.59,721.00 C773.63,718.25 777.25,716.00 777.64,716.00 C778.03,716.00 779.05,715.37 779.92,714.59 C781.82,712.90 788.15,709.43 801.21,702.91 C809.63,698.72 828.93,692.00 836.90,690.49 C849.19,688.17 860.33,686.86 864.73,687.23 C868.67,687.55 870.00,687.33 870.00,686.33 C870.00,685.60 870.69,685.00 871.54,685.00 C872.43,685.00 872.96,684.30 872.79,683.35 C872.63,682.45 873.13,681.49 873.91,681.22 C874.88,680.88 875.12,681.23 874.69,682.36 C874.35,683.26 874.50,684.00 875.03,684.00 C875.56,684.00 876.00,683.33 876.00,682.50 C876.00,681.67 876.38,681.00 876.85,681.00 C877.31,681.00 878.51,679.20 879.50,677.00 C880.49,674.80 881.61,673.00 881.98,673.00 C882.35,673.00 884.13,670.07 885.92,666.50 C887.72,662.92 889.60,659.75 890.10,659.44 C890.59,659.13 891.00,658.17 891.00,657.30 C891.00,656.43 891.79,655.08 892.75,654.29 C893.71,653.50 893.94,653.14 893.25,653.48 C892.39,653.92 892.02,653.24 892.07,651.31 C892.13,648.84 892.24,648.74 893.00,650.50 C893.84,652.46 893.86,652.46 893.93,650.40 C894.05,646.72 896.93,642.04 898.66,642.70 C899.92,643.18 900.09,642.82 899.55,640.90 C899.13,639.41 899.20,638.98 899.75,639.76 C900.39,640.67 901.37,639.89 903.32,636.92 C906.94,631.38 906.87,629.00 903.06,629.00 C901.44,629.00 899.84,628.54 899.49,627.98 C899.14,627.42 898.51,627.18 898.08,627.45 C897.65,627.72 887.67,628.18 875.90,628.48 C832.09,629.61 818.33,631.49 799.00,638.98 C795.98,640.16 792.69,641.29 791.70,641.51 C790.70,641.73 787.40,643.08 784.36,644.53 C781.31,645.97 778.22,646.92 777.49,646.64 C776.76,646.36 775.92,646.77 775.61,647.56 C775.31,648.35 774.15,649.00 773.03,649.00 C771.48,649.00 771.00,649.66 770.99,651.75 C770.98,655.04 768.84,662.17 766.42,667.00 C763.57,672.70 757.84,677.26 749.77,680.25 C741.40,683.35 734.72,683.75 729.29,681.48 C726.71,680.40 725.33,680.27 724.58,681.02 C723.83,681.77 723.95,682.36 725.01,683.03 C726.16,683.75 725.87,683.97 723.77,683.98 C721.98,683.99 720.49,684.85 719.41,686.50 C718.51,687.88 716.92,689.00 715.88,689.00 C714.85,689.00 714.00,689.40 714.00,689.90 C714.00,690.39 711.64,692.29 708.75,694.11 C703.51,697.43 702.59,698.25 698.14,703.64 C696.62,705.49 695.61,706.06 695.31,705.25 C694.57,703.30 692.29,703.78 691.71,706.00 C691.30,707.58 690.35,708.00 687.17,708.00 C684.92,708.00 682.48,708.66 681.64,709.50 C680.82,710.33 679.87,711.00 679.53,711.00 C678.70,711.00 668.63,717.97 656.96,726.63 C651.72,730.52 646.33,734.29 645.00,735.00 C641.51,736.87 624.30,749.63 619.00,754.28 C616.52,756.45 613.83,758.51 613.00,758.86 C611.05,759.69 583.82,777.62 573.49,784.87 C569.09,787.97 564.59,791.05 563.49,791.72 C547.63,801.42 537.50,807.09 533.00,808.77 C529.98,809.90 521.39,813.31 513.92,816.36 C506.45,819.40 498.13,822.43 495.42,823.09 C489.55,824.53 489.11,824.82 491.03,826.04 C493.26,827.45 495.75,827.22 508.00,824.46 M 445.09,793.54 C473.42,789.16 504.74,778.23 521.68,766.82 C523.98,765.27 526.10,764.00 526.40,764.00 C526.70,764.00 528.87,762.70 531.22,761.11 C533.57,759.53 538.88,756.02 543.01,753.33 C547.15,750.63 553.90,745.95 558.01,742.92 C562.13,739.89 569.10,735.19 573.50,732.49 C577.90,729.79 581.73,727.31 582.00,726.98 C582.27,726.66 584.30,725.32 586.50,724.00 C588.70,722.69 593.65,719.09 597.50,716.00 C601.35,712.91 606.30,709.31 608.50,708.00 C610.70,706.68 612.73,705.33 613.00,704.99 C613.76,704.04 622.78,698.00 623.43,698.00 C624.06,698.00 643.21,684.00 644.00,682.96 C644.27,682.59 646.30,681.14 648.50,679.72 C650.70,678.30 654.98,675.33 658.00,673.11 C661.02,670.89 666.31,667.20 669.75,664.90 C673.19,662.60 676.00,660.38 676.00,659.96 C676.00,659.54 677.42,658.70 679.16,658.09 C680.90,657.49 683.79,655.87 685.59,654.50 C687.39,653.12 689.35,652.00 689.93,652.00 C690.52,652.00 691.00,651.55 691.00,651.00 C691.00,650.45 691.67,650.00 692.50,650.00 C693.33,650.00 694.00,649.54 694.00,648.98 C694.00,648.42 695.11,647.45 696.47,646.83 C698.40,645.95 699.31,646.01 700.64,647.10 C702.18,648.37 702.27,648.25 701.65,645.75 C701.08,643.47 701.29,643.00 702.87,643.00 C703.93,643.00 705.05,642.33 705.36,641.50 C705.68,640.67 706.52,640.00 707.23,640.00 C707.94,640.00 709.12,639.03 709.86,637.85 C710.94,636.12 711.37,635.98 712.08,637.10 C712.71,638.10 712.97,638.14 712.98,637.25 C713.01,634.88 719.91,628.38 725.26,625.67 C728.21,624.17 732.99,622.67 735.88,622.33 C738.80,621.98 740.61,621.37 739.94,620.96 C739.28,620.56 742.17,620.22 746.36,620.22 C750.55,620.22 753.77,620.56 753.51,620.98 C753.04,621.74 758.97,621.36 759.75,620.58 C759.98,620.35 759.21,619.21 758.05,618.05 L 755.93,615.93 L 758.98,614.65 C760.66,613.94 761.73,613.06 761.35,612.68 C760.97,612.31 761.91,612.00 763.44,612.00 C765.49,612.00 766.06,611.61 765.64,610.50 C765.28,609.57 765.64,609.00 766.59,609.00 C767.43,609.00 767.87,608.60 767.57,608.11 C767.27,607.63 767.90,607.00 768.98,606.72 C770.31,606.37 771.12,606.82 771.54,608.13 C772.66,611.66 776.95,609.52 776.98,605.42 C777.00,603.75 777.99,603.12 782.08,602.17 C784.87,601.53 788.22,601.00 789.52,601.00 C790.82,601.00 792.16,600.55 792.50,600.00 C792.84,599.45 794.46,599.00 796.09,599.00 C799.08,599.00 815.28,594.10 815.75,593.06 C815.89,592.75 819.71,592.76 824.25,593.08 C831.13,593.56 833.02,593.35 835.62,591.83 C837.33,590.82 840.33,590.00 842.28,590.00 C844.24,590.00 846.00,589.50 846.20,588.89 C846.46,588.13 852.66,587.72 865.54,587.60 C875.97,587.51 885.04,587.09 885.71,586.68 C887.42,585.62 891.00,588.12 891.00,590.38 C891.00,592.05 891.31,591.96 893.64,589.64 C895.89,587.39 897.13,587.00 902.14,587.00 C906.68,587.00 908.00,587.34 908.00,588.50 C908.00,589.95 906.14,590.33 900.00,590.14 C897.72,590.07 897.76,590.15 900.50,591.05 C903.88,592.15 911.00,591.34 911.00,589.85 C911.00,589.32 910.44,589.17 909.75,589.52 C909.06,589.86 909.40,589.42 910.50,588.52 C912.40,586.98 912.52,587.02 912.82,589.45 C913.00,590.95 913.77,592.00 914.68,592.00 C916.08,592.00 916.07,592.24 914.67,594.39 C912.56,597.60 913.73,598.47 916.53,595.77 C918.91,593.49 918.80,591.00 916.32,591.00 C915.46,591.00 914.99,590.27 915.19,589.25 C915.43,587.99 916.65,587.42 919.62,587.20 C924.21,586.86 924.98,585.85 927.05,577.50 C927.74,574.75 928.68,572.07 929.15,571.55 C929.62,571.03 930.00,569.59 930.00,568.36 C930.00,567.13 930.45,565.84 931.00,565.50 C931.55,565.16 932.00,563.59 932.00,562.00 C932.00,560.41 932.45,558.84 933.00,558.50 C933.55,558.16 934.00,556.59 934.00,555.00 C934.00,553.41 934.40,551.87 934.88,551.57 C935.37,551.27 936.01,549.78 936.31,548.26 C938.05,539.48 939.93,532.67 940.90,531.70 C941.50,531.10 942.00,528.98 942.00,527.00 C942.00,525.02 942.43,522.97 942.96,522.44 C943.49,521.91 944.04,518.67 944.17,515.24 C944.31,511.81 944.68,509.00 944.99,509.00 C945.31,509.00 945.66,507.09 945.77,504.75 C945.89,502.41 946.22,498.93 946.51,497.00 C948.40,484.43 949.13,465.61 948.60,442.50 C948.27,428.20 947.80,414.93 947.56,413.00 C946.68,406.17 943.91,390.45 942.96,386.87 C942.43,384.88 941.82,381.96 941.61,380.37 C941.40,378.79 940.68,375.25 940.02,372.50 C939.36,369.75 938.67,366.82 938.48,366.00 C938.30,365.18 938.07,364.27 937.96,364.00 C937.85,363.73 937.83,363.12 937.92,362.64 C938.00,362.17 937.68,361.27 937.20,360.64 C936.72,360.02 935.51,355.90 934.52,351.50 C930.62,334.19 919.49,304.81 908.79,283.59 C904.96,276.00 888.09,248.59 881.65,239.50 C868.44,220.84 842.82,190.27 834.37,183.05 C832.79,181.71 827.39,176.96 822.37,172.49 C797.32,150.24 766.42,130.22 729.61,112.41 C701.66,98.89 665.51,87.21 635.50,82.01 C628.90,80.87 621.25,79.51 618.50,78.98 C604.23,76.27 549.68,75.05 534.15,77.11 C531.04,77.52 525.80,78.09 522.50,78.39 C511.77,79.34 496.78,81.93 480.75,85.58 C458.59,90.64 446.27,95.62 435.21,104.01 C432.31,106.22 429.38,108.13 428.71,108.26 C428.05,108.39 426.92,109.28 426.21,110.23 C425.49,111.19 422.79,113.41 420.21,115.17 C417.62,116.93 415.27,118.63 415.00,118.94 C414.73,119.25 411.94,121.42 408.80,123.75 L 403.11,127.98 L 399.83,124.99 C397.48,122.85 397.03,122.00 398.22,122.00 C400.70,122.00 401.27,120.30 398.99,119.71 C397.74,119.38 397.24,119.58 397.65,120.25 C398.10,120.97 396.74,121.14 393.41,120.77 C390.71,120.47 389.31,120.43 390.30,120.69 C391.73,121.07 391.86,121.46 390.93,122.58 C389.60,124.19 387.55,124.54 388.50,123.00 C389.66,121.12 386.05,122.00 380.77,124.87 C369.80,130.83 365.42,133.34 362.85,135.14 C361.39,136.16 359.87,137.00 359.48,137.00 C358.83,137.00 349.16,143.72 348.00,144.98 C347.73,145.27 345.59,146.76 343.25,148.27 C340.91,149.79 339.00,151.36 339.00,151.77 C339.00,152.18 337.76,153.06 336.25,153.73 C332.09,155.58 313.23,170.08 307.00,176.22 C299.59,183.52 273.80,211.99 261.86,226.04 C256.62,232.22 238.30,259.91 232.46,270.50 C230.34,274.35 227.20,279.75 225.48,282.50 C223.77,285.25 221.33,289.98 220.06,293.00 C218.79,296.02 216.29,301.43 214.51,305.00 C212.73,308.57 210.71,313.30 210.03,315.50 C209.34,317.70 207.77,321.98 206.53,325.00 C201.35,337.64 200.45,344.81 200.91,369.50 C201.26,387.68 208.21,424.11 213.54,435.65 C214.35,437.38 215.00,439.18 215.00,439.65 C215.00,443.04 232.10,479.05 235.62,483.08 C236.38,483.95 237.00,485.03 237.00,485.49 C237.00,487.44 247.08,502.35 255.72,513.18 C264.28,523.91 291.16,551.00 293.24,551.00 C294.09,551.00 296.52,552.64 304.67,558.75 C308.64,561.72 315.17,565.57 327.00,571.91 C331.12,574.12 336.07,576.79 338.00,577.84 C343.30,580.73 345.91,581.81 352.88,584.00 C360.02,586.24 361.38,586.43 360.53,585.06 C359.84,583.93 366.52,584.19 367.66,585.33 C368.09,585.76 367.55,585.79 366.47,585.41 C364.88,584.84 364.73,584.96 365.71,586.02 C366.68,587.06 366.38,587.82 364.21,589.74 C357.75,595.50 337.70,609.35 287.87,642.51 L 259.24,661.56 L 256.10,659.14 C253.07,656.80 252.90,656.78 250.98,658.51 C249.19,660.13 249.00,660.15 249.00,658.65 C249.00,657.74 249.68,657.00 250.50,657.00 C251.32,657.00 252.00,656.55 252.00,656.00 C252.00,654.73 251.35,654.74 248.92,656.04 C247.85,656.62 247.03,656.73 247.10,656.29 C247.18,655.86 247.15,654.60 247.05,653.50 L 246.86,651.50 L 246.00,653.50 C245.18,655.40 245.14,655.39 245.07,653.23 C245.00,651.11 234.32,639.00 232.51,639.00 C232.10,639.00 232.37,639.74 233.11,640.64 C233.86,641.54 234.52,642.77 234.58,643.39 C234.64,644.00 234.76,645.05 234.85,645.72 C234.93,646.39 235.63,646.70 236.40,646.40 C237.17,646.11 238.09,646.34 238.46,646.93 C238.82,647.52 238.42,648.00 237.56,648.00 C236.37,648.00 236.97,649.83 240.12,655.75 C242.38,660.01 244.63,663.65 245.12,663.83 C245.60,664.02 246.01,664.69 246.02,665.33 C246.04,666.85 251.55,673.11 252.25,672.41 C252.55,672.12 251.71,670.71 250.39,669.28 C249.06,667.85 248.19,666.48 248.44,666.23 C248.69,665.98 247.57,664.36 245.95,662.64 C242.82,659.29 241.68,655.66 244.50,658.00 C245.33,658.68 246.00,659.66 246.00,660.17 C246.00,661.70 251.41,665.98 252.75,665.50 C254.36,664.94 254.36,666.22 252.75,667.95 C251.74,669.03 251.76,669.14 252.86,668.52 C253.67,668.06 254.57,668.30 255.07,669.11 C256.11,670.79 255.64,666.40 254.49,663.67 C253.95,662.38 253.50,662.19 252.99,663.02 C252.49,663.83 252.04,663.88 251.60,663.16 C251.24,662.58 251.97,661.57 253.22,660.91 C254.47,660.26 255.16,660.09 254.75,660.53 C253.91,661.43 256.75,665.00 258.31,665.00 C258.86,665.00 258.45,664.03 257.40,662.85 L 255.50,660.69 L 258.50,662.53 C260.15,663.55 262.29,665.04 263.26,665.85 C264.83,667.17 265.26,667.11 267.26,665.26 C271.98,660.91 341.81,615.35 343.15,615.75 C343.62,615.89 344.00,615.57 344.00,615.05 C344.00,614.52 346.02,612.70 348.50,611.00 C350.98,609.30 353.00,608.28 353.00,608.74 C353.00,610.12 344.25,617.00 342.50,617.00 C341.52,617.00 341.17,617.46 341.61,618.17 C342.09,618.96 341.78,619.13 340.66,618.70 C338.84,618.00 338.44,619.04 339.96,620.56 C341.29,621.89 339.98,623.60 337.00,624.43 C335.31,624.90 334.94,624.83 335.86,624.19 C336.60,623.67 336.81,623.00 336.32,622.70 C335.83,622.40 333.94,623.45 332.13,625.03 L 328.82,627.92 L 331.49,628.59 C333.97,629.21 334.13,629.59 333.83,633.88 C333.51,638.34 333.63,638.56 337.25,640.33 C339.31,641.34 341.00,642.55 341.00,643.02 C341.00,643.49 339.31,644.02 337.25,644.19 C334.72,644.40 333.50,644.99 333.50,646.00 C333.50,646.87 334.23,647.38 335.25,647.21 C336.21,647.04 337.00,647.38 337.00,647.96 C337.00,648.53 338.57,649.00 340.50,649.00 C343.57,649.00 344.00,649.31 344.00,651.50 C344.00,652.88 344.45,654.00 345.00,654.00 C345.55,654.00 346.00,654.67 346.00,655.50 C346.00,657.70 344.32,657.33 343.71,655.00 C343.42,653.90 342.48,653.00 341.63,653.00 C340.65,653.00 340.28,653.56 340.64,654.50 C340.95,655.33 341.62,656.00 342.11,656.00 C342.60,656.00 343.00,656.62 343.00,657.37 C343.00,658.26 344.68,658.94 347.75,659.32 C352.30,659.87 352.90,659.64 362.00,653.57 C367.23,650.09 373.07,646.45 375.00,645.48 C376.93,644.52 379.94,642.55 381.69,641.11 C383.45,639.68 389.75,635.41 395.69,631.62 C401.64,627.84 415.47,618.84 426.44,611.62 C437.41,604.41 448.67,597.15 451.47,595.50 C459.27,590.89 494.77,567.49 537.66,538.68 C554.35,527.47 575.44,513.71 581.14,510.32 C583.15,509.13 588.78,505.48 593.65,502.22 C608.24,492.46 640.21,471.55 644.50,468.98 C646.70,467.66 649.06,466.03 649.75,465.36 C650.43,464.69 653.81,462.45 657.25,460.38 C660.69,458.32 663.73,456.37 664.00,456.05 C664.27,455.74 669.58,452.15 675.79,448.08 C686.29,441.19 696.04,437.04 696.83,439.13 C697.02,439.61 698.93,440.00 701.08,440.00 C703.67,440.00 705.68,440.68 707.00,442.00 C709.15,444.15 711.58,444.75 710.40,442.84 C710.00,442.20 712.06,443.88 714.96,446.59 C723.73,454.74 727.95,467.41 724.57,475.48 C721.51,482.82 716.81,487.85 708.00,493.22 C703.33,496.06 691.96,503.37 682.74,509.45 C673.52,515.53 660.02,524.30 652.74,528.95 C633.30,541.36 581.19,575.27 552.40,594.25 C538.60,603.35 515.65,618.46 501.40,627.83 C487.16,637.21 456.03,657.84 432.23,673.69 C355.61,724.71 361.13,721.47 354.34,719.47 C353.33,719.17 354.30,719.79 356.50,720.85 C363.79,724.38 370.44,727.02 375.50,728.43 C378.25,729.19 384.32,730.92 389.00,732.27 C412.76,739.12 444.19,738.26 468.75,730.07 C487.15,723.94 500.81,716.08 535.50,691.65 C551.91,680.09 573.14,665.88 574.88,665.29 C577.60,664.36 570.57,670.28 564.61,673.94 C561.53,675.84 559.43,677.65 559.95,677.97 C560.47,678.29 560.53,679.15 560.07,679.88 C559.50,680.81 559.04,680.88 558.57,680.11 C557.52,678.42 556.20,678.79 556.36,680.72 C556.45,681.88 555.25,682.86 552.68,683.72 C548.46,685.13 545.48,687.56 546.90,688.44 C547.41,688.75 548.65,688.75 549.66,688.44 C550.67,688.13 550.15,688.67 548.50,689.65 C546.85,690.62 545.23,691.35 544.89,691.26 C544.55,691.17 543.78,692.20 543.16,693.55 C542.13,695.82 542.24,696.01 544.77,696.08 C546.27,696.12 548.32,696.31 549.33,696.50 C550.57,696.74 550.98,696.39 550.61,695.42 C549.74,693.15 554.62,690.65 559.80,690.72 C564.07,690.78 564.27,690.67 562.46,689.33 C560.61,687.95 560.66,687.91 563.25,688.54 C566.12,689.25 566.82,688.22 564.83,686.23 C563.94,685.34 564.06,684.91 565.33,684.43 C566.25,684.07 567.00,683.16 567.00,682.39 C567.00,681.63 567.93,681.00 569.06,681.00 C570.19,681.00 570.84,680.55 570.50,680.00 C570.15,679.43 570.98,679.00 572.42,679.00 C574.30,679.00 575.13,679.65 575.60,681.53 C576.57,685.41 579.51,686.51 581.54,683.75 C582.66,682.24 583.37,681.91 583.69,682.75 C583.95,683.44 585.70,684.00 587.58,684.00 C589.95,684.00 591.00,684.46 591.00,685.50 C591.00,687.49 591.97,687.40 593.64,685.25 C594.93,683.59 595.08,683.61 596.53,685.48 C598.43,687.94 598.09,689.95 595.54,691.39 C592.30,693.23 591.08,694.68 591.98,695.61 C592.45,696.10 592.99,698.08 593.17,700.00 C593.42,702.69 593.13,703.50 591.89,703.52 C589.57,703.54 587.29,705.69 586.58,708.53 C586.21,709.99 585.00,711.21 583.56,711.58 C582.23,711.91 580.90,712.81 580.60,713.59 C580.31,714.37 579.41,715.00 578.61,715.00 C577.81,715.00 575.43,716.72 573.33,718.82 C571.22,720.92 567.70,723.71 565.50,725.01 C563.30,726.32 559.70,728.83 557.50,730.61 C555.30,732.38 552.93,733.98 552.24,734.17 C551.55,734.35 548.64,736.64 545.79,739.25 C542.93,741.86 540.26,744.00 539.85,744.00 C539.44,744.00 536.36,746.28 533.02,749.07 C525.93,754.96 514.32,761.84 498.64,769.43 C480.38,778.26 477.60,779.21 460.50,782.48 C456.65,783.22 449.45,784.62 444.50,785.60 C434.65,787.54 408.96,788.08 388.00,786.79 L 376.50,786.08 L 384.00,789.68 C388.12,791.66 393.75,793.61 396.50,794.01 C405.64,795.36 435.20,795.07 445.09,793.54 M 350.50,718.00 C347.75,716.82 346.17,716.82 348.00,718.00 C348.82,718.53 350.18,718.94 351.00,718.91 C351.99,718.88 351.82,718.57 350.50,718.00 M 345.50,716.00 C345.16,715.45 344.35,715.01 343.69,715.02 C342.98,715.02 343.10,715.42 344.00,716.00 C345.92,717.24 346.27,717.24 345.50,716.00 M 535.00,703.00 C535.00,702.45 534.55,702.00 534.00,702.00 C533.45,702.00 533.00,702.45 533.00,703.00 C533.00,703.55 533.45,704.00 534.00,704.00 C534.55,704.00 535.00,703.55 535.00,703.00 M 542.00,701.12 C542.00,700.10 537.85,698.82 537.07,699.59 C536.43,700.24 539.08,701.96 540.75,701.98 C541.44,701.99 542.00,701.60 542.00,701.12 M 536.33,695.42 C536.03,694.64 535.57,694.00 535.30,694.00 C534.35,694.00 531.20,698.51 531.64,699.23 C532.45,700.54 536.91,696.93 536.33,695.42 M 579.00,690.44 C579.00,689.65 578.33,689.00 577.50,689.00 C575.99,689.00 575.44,691.11 576.64,692.31 C577.57,693.24 579.00,692.11 579.00,690.44 M 286.58,684.61 C290.10,685.49 289.56,684.52 284.75,681.27 C280.15,678.17 277.00,676.70 277.00,677.67 C277.00,678.01 277.79,678.93 278.75,679.72 C280.42,681.09 280.42,681.14 278.75,680.61 C277.79,680.31 277.00,680.45 277.00,680.92 C277.00,681.40 278.14,682.07 279.54,682.42 C280.94,682.77 282.37,683.81 282.73,684.73 C283.13,685.78 283.51,685.96 283.77,685.20 C284.01,684.47 285.11,684.24 286.58,684.61 M 266.66,681.56 C265.90,679.58 269.71,674.95 271.54,675.65 C273.90,676.56 273.21,674.41 270.75,673.18 C268.51,672.06 268.51,672.05 271.00,672.38 C272.38,672.56 272.94,672.52 272.25,672.28 C271.56,672.05 271.00,671.39 271.00,670.82 C271.00,670.25 270.30,670.05 269.45,670.38 C268.59,670.71 268.14,670.58 268.44,670.09 C268.74,669.61 268.24,668.92 267.32,668.57 C266.41,668.22 265.36,668.42 264.99,669.02 C264.58,669.68 263.20,669.84 261.55,669.42 C258.96,668.77 258.86,668.87 259.94,670.89 C260.57,672.07 260.79,673.53 260.42,674.13 C259.98,674.85 260.47,674.99 261.87,674.54 C263.78,673.93 263.96,674.19 263.64,677.13 C263.30,680.24 264.53,682.88 266.36,682.96 C266.83,682.98 266.97,682.35 266.66,681.56 M 344.38,662.45 C344.71,661.59 344.55,661.16 344.03,661.48 C342.77,662.26 339.00,659.85 339.00,658.26 C339.00,656.86 337.40,656.55 336.62,657.80 C335.85,659.05 337.28,660.74 340.52,662.44 C344.12,664.31 343.67,664.31 344.38,662.45 M 897.96,647.07 C899.26,644.65 899.27,644.00 898.00,644.00 C897.45,644.00 897.00,644.67 897.00,645.50 C897.00,646.33 896.55,647.00 896.00,647.00 C895.45,647.00 895.00,647.45 895.00,648.00 C895.00,649.70 896.87,649.11 897.96,647.07 M 325.00,633.00 C325.00,632.45 324.32,632.00 323.50,632.00 C322.68,632.00 322.00,632.45 322.00,633.00 C322.00,633.55 322.68,634.00 323.50,634.00 C324.32,634.00 325.00,633.55 325.00,633.00 M 328.66,630.75 C328.38,630.06 328.16,630.62 328.16,632.00 C328.16,633.38 328.38,633.94 328.66,633.25 C328.94,632.56 328.94,631.44 328.66,630.75 M 764.00,616.00 C764.00,615.45 763.80,615.00 763.56,615.00 C763.32,615.00 762.84,615.45 762.50,616.00 C762.16,616.55 762.36,617.00 762.94,617.00 C763.52,617.00 764.00,616.55 764.00,616.00 M 770.50,609.00 C770.84,608.45 770.64,608.00 770.06,608.00 C769.48,608.00 769.00,608.45 769.00,609.00 C769.00,609.55 769.20,610.00 769.44,610.00 C769.68,610.00 770.16,609.55 770.50,609.00 M 780.00,607.30 C780.00,605.44 779.68,604.92 778.97,605.63 C778.40,606.20 778.22,607.42 778.57,608.33 C779.50,610.75 780.00,610.38 780.00,607.30 M 402.75,115.80 C406.19,114.54 409.00,113.16 409.00,112.75 C409.00,111.38 406.57,112.10 399.50,115.58 C391.88,119.32 392.98,119.40 402.75,115.80 M 414.82,114.95 C416.09,113.77 417.55,113.21 418.26,113.64 C419.04,114.11 418.97,113.73 418.09,112.64 C417.09,111.42 416.47,111.25 415.96,112.06 C415.54,112.75 414.29,112.94 412.87,112.54 C411.07,112.03 410.86,112.12 412.00,112.90 C413.29,113.78 413.22,114.13 411.50,115.43 C409.92,116.62 409.83,116.94 411.06,116.97 C411.92,116.99 413.61,116.08 414.82,114.95 M 426.00,105.00 C426.82,104.47 427.05,104.03 426.50,104.03 C425.95,104.03 424.82,104.47 424.00,105.00 C423.18,105.53 422.95,105.97 423.50,105.97 C424.05,105.97 425.18,105.53 426.00,105.00 M 726.00,741.00 C726.00,740.45 726.45,740.00 727.00,740.00 C727.55,740.00 728.00,740.45 728.00,741.00 C728.00,741.55 727.55,742.00 727.00,742.00 C726.45,742.00 726.00,741.55 726.00,741.00 M 704.00,730.50 C704.00,727.17 704.17,727.00 707.50,727.00 C710.83,727.00 711.00,727.17 711.00,730.50 C711.00,733.83 710.83,734.00 707.50,734.00 C704.17,734.00 704.00,733.83 704.00,730.50 M 702.00,704.61 C702.00,704.39 702.70,703.95 703.55,703.62 C704.44,703.28 704.84,703.44 704.49,704.01 C703.91,704.96 702.00,705.42 702.00,704.61 M 874.38,679.54 C873.98,678.51 874.27,677.44 875.10,676.91 C877.47,675.42 878.12,675.90 876.90,678.25 C875.25,681.43 875.13,681.49 874.38,679.54 M 877.50,674.00 C877.84,673.45 878.57,673.00 879.12,673.00 C879.67,673.00 879.84,673.45 879.50,674.00 C879.16,674.55 878.43,675.00 877.88,675.00 C877.33,675.00 877.16,674.55 877.50,674.00 M 599.00,691.47 C599.00,689.71 599.55,689.00 600.91,689.00 C602.30,689.00 602.68,689.52 602.31,690.93 C601.51,693.98 599.00,694.39 599.00,691.47 M 557.51,687.98 C557.86,687.42 558.56,687.23 559.07,687.54 C560.46,688.40 560.20,689.00 558.44,689.00 C557.58,689.00 557.16,688.54 557.51,687.98 M 592.00,681.00 C590.91,680.30 591.73,680.03 595.00,680.03 C598.27,680.03 599.09,680.30 598.00,681.00 C597.17,681.53 595.83,681.97 595.00,681.97 C594.17,681.97 592.83,681.53 592.00,681.00 M 580.00,661.00 C581.92,659.38 583.95,658.06 584.50,658.07 C585.05,658.08 583.94,659.41 582.04,661.04 C580.13,662.67 578.11,663.99 577.54,663.97 C576.97,663.96 578.08,662.62 580.00,661.00 M 588.32,655.54 C589.86,654.03 591.35,653.02 591.62,653.29 C591.89,653.56 590.63,654.79 588.81,656.03 L 585.50,658.28 L 588.32,655.54 M 352.54,655.07 C352.23,654.56 352.42,653.86 352.98,653.51 C353.54,653.16 354.00,653.58 354.00,654.44 C354.00,656.20 353.40,656.46 352.54,655.07 M 359.00,653.12 C359.00,652.22 362.00,650.67 362.60,651.26 C362.77,651.44 362.03,652.12 360.95,652.80 C359.88,653.47 359.00,653.61 359.00,653.12 M 596.00,650.00 C596.00,649.45 596.48,649.00 597.06,649.00 C597.64,649.00 597.84,649.45 597.50,650.00 C597.16,650.55 596.68,651.00 596.44,651.00 C596.20,651.00 596.00,650.55 596.00,650.00 M 364.00,649.11 C364.00,648.62 364.71,647.94 365.58,647.61 C368.03,646.67 368.35,646.87 367.00,648.50 C365.62,650.16 364.00,650.49 364.00,649.11 M 599.04,648.26 C599.09,647.33 606.10,642.77 606.65,643.31 C606.86,643.53 605.23,644.90 603.02,646.37 C600.81,647.83 599.02,648.68 599.04,648.26 M 344.00,647.00 C344.00,646.45 344.45,646.00 345.00,646.00 C345.55,646.00 346.00,646.45 346.00,647.00 C346.00,647.55 345.55,648.00 345.00,648.00 C344.45,648.00 344.00,647.55 344.00,647.00 M 370.00,645.01 C370.00,644.46 370.84,644.00 371.87,644.00 C372.89,644.00 374.94,643.05 376.42,641.89 C379.11,639.77 381.24,639.72 378.70,641.84 C376.37,643.77 370.00,646.09 370.00,645.01 M 235.00,643.94 C235.00,643.36 235.45,643.16 236.00,643.50 C236.55,643.84 237.00,644.32 237.00,644.56 C237.00,644.80 236.55,645.00 236.00,645.00 C235.45,645.00 235.00,644.52 235.00,643.94 M 332.00,627.00 C332.00,626.45 332.65,626.00 333.44,626.00 C334.23,626.00 335.16,626.45 335.50,627.00 C335.84,627.55 335.19,628.00 334.06,628.00 C332.93,628.00 332.00,627.55 332.00,627.00 M 632.05,625.45 C632.75,624.59 634.27,623.40 635.42,622.81 C637.28,621.84 637.24,622.01 635.08,624.36 C632.51,627.15 629.84,628.10 632.05,625.45 M 933.50,533.00 C933.16,532.45 933.36,532.00 933.94,532.00 C934.52,532.00 935.00,532.45 935.00,533.00 C935.00,533.55 934.80,534.00 934.56,534.00 C934.32,534.00 933.84,533.55 933.50,533.00 M 796.81,532.32 C797.53,532.03 798.40,532.06 798.73,532.40 C799.06,532.73 798.47,532.96 797.42,532.92 C796.25,532.87 796.01,532.64 796.81,532.32 M 805.81,530.32 C806.53,530.03 807.40,530.06 807.73,530.40 C808.06,530.73 807.47,530.96 806.42,530.92 C805.25,530.87 805.01,530.64 805.81,530.32 M 347.46,516.93 C346.38,515.19 347.61,514.82 348.98,516.48 C349.77,517.43 349.84,518.00 349.18,518.00 C348.60,518.00 347.82,517.52 347.46,516.93 M 343.66,513.55 C343.29,512.58 343.58,512.29 344.55,512.66 C346.13,513.26 346.54,515.00 345.11,515.00 C344.62,515.00 343.96,514.35 343.66,513.55 M 424.51,500.01 C424.16,499.44 424.56,499.28 425.45,499.62 C427.18,500.28 427.50,501.00 426.06,501.00 C425.54,501.00 424.84,500.56 424.51,500.01 M 319.32,493.74 C315.37,490.31 312.11,487.14 312.07,486.69 C312.03,486.25 310.09,483.85 307.75,481.36 C303.31,476.62 301.71,474.35 301.38,472.25 C300.95,469.58 302.99,471.25 307.37,477.14 C309.87,480.52 313.31,484.12 315.00,485.14 C316.69,486.17 318.37,487.80 318.74,488.76 C319.10,489.72 321.68,492.62 324.45,495.21 C331.98,502.24 327.68,501.01 319.32,493.74 M 418.97,495.18 C418.12,494.81 413.40,491.82 408.47,488.54 C393.90,478.85 375.37,462.83 376.54,460.94 C377.51,459.37 478.46,393.25 511.00,372.87 C517.33,368.91 529.25,361.17 537.50,355.67 C545.75,350.16 563.52,338.71 577.00,330.22 C590.48,321.72 606.14,311.79 611.82,308.14 C634.15,293.77 666.12,273.57 678.00,266.32 C698.75,253.66 707.99,247.55 707.98,246.50 C707.98,245.95 693.56,237.42 675.93,227.54 C658.30,217.67 642.09,208.06 639.91,206.19 C632.90,200.19 631.29,194.32 634.99,188.24 C639.24,181.28 646.26,179.51 657.70,182.53 C660.89,183.37 672.50,186.10 683.50,188.59 C705.93,193.69 736.17,201.32 757.00,207.15 C758.92,207.69 762.08,208.51 764.00,208.98 C778.54,212.50 786.56,218.23 790.99,228.25 C795.08,237.50 794.72,243.82 788.84,266.00 C786.60,274.44 785.59,278.48 784.09,285.00 C777.18,315.17 765.35,360.64 763.34,364.83 C760.23,371.28 756.29,373.99 749.98,374.00 C746.37,374.00 744.68,373.36 741.60,370.82 C734.75,365.18 734.62,364.40 734.19,327.75 C733.99,309.74 733.47,295.00 733.05,295.00 C731.12,295.00 716.39,304.03 692.00,320.15 C677.42,329.78 655.15,344.28 642.50,352.36 C599.84,379.62 582.65,390.77 542.00,417.53 C462.15,470.09 422.11,496.03 421.00,495.91 C420.73,495.88 419.81,495.55 418.97,495.18 M 296.66,467.41 L 294.95,463.83 L 298.02,466.01 C300.47,467.76 300.85,468.48 299.92,469.60 C298.42,471.41 298.63,471.55 296.66,467.41 M 741.08,448.42 C741.13,447.25 741.36,447.01 741.68,447.81 C741.97,448.53 741.94,449.40 741.60,449.73 C741.27,450.06 741.04,449.47 741.08,448.42 M 742.65,441.00 C743.44,436.69 744.01,435.87 743.98,439.08 C743.98,440.41 743.53,442.18 742.99,443.00 C742.29,444.06 742.19,443.46 742.65,441.00 M 741.35,426.46 C741.02,425.61 740.98,424.69 741.25,424.42 C741.52,424.14 741.99,424.84 742.28,425.96 C742.90,428.34 742.21,428.71 741.35,426.46 M 339.33,413.25 C338.47,411.19 335.74,405.00 333.26,399.50 C328.02,387.86 322.00,370.26 322.00,366.59 C322.00,364.90 322.92,363.47 324.75,362.33 C333.93,356.60 365.67,335.67 371.82,331.27 C375.85,328.40 382.89,323.79 387.46,321.02 C395.72,316.03 395.83,316.00 404.14,316.06 C417.39,316.14 425.09,320.23 430.40,330.00 C432.87,334.53 433.29,336.45 433.37,343.39 C433.45,350.59 433.13,352.10 430.50,356.88 C427.00,363.24 419.38,369.77 409.90,374.55 C406.22,376.41 393.59,384.15 381.85,391.75 C355.01,409.14 342.48,417.00 341.59,417.00 C341.21,417.00 340.19,415.31 339.33,413.25 M 736.50,415.00 C736.16,414.45 736.36,414.00 736.94,414.00 C737.52,414.00 738.00,414.45 738.00,415.00 C738.00,415.55 737.80,416.00 737.56,416.00 C737.32,416.00 736.84,415.55 736.50,415.00 M 678.81,392.32 C679.53,392.03 680.40,392.06 680.73,392.40 C681.06,392.73 680.47,392.96 679.42,392.92 C678.25,392.87 678.01,392.64 678.81,392.32 M 704.75,392.34 C705.44,392.06 706.56,392.06 707.25,392.34 C707.94,392.62 707.38,392.84 706.00,392.84 C704.62,392.84 704.06,392.62 704.75,392.34 M 822.73,340.88 C823.41,340.19 824.22,339.89 824.53,340.19 C824.83,340.50 824.28,341.06 823.29,341.44 C821.87,341.98 821.75,341.86 822.73,340.88 M 842.81,340.32 C843.53,340.03 844.40,340.06 844.73,340.40 C845.06,340.73 844.47,340.96 843.42,340.92 C842.25,340.87 842.01,340.64 842.81,340.32 M 826.81,339.32 C827.53,339.03 828.40,339.06 828.73,339.40 C829.06,339.73 828.47,339.96 827.42,339.92 C826.25,339.87 826.01,339.64 826.81,339.32 M 355.00,142.10 C355.00,141.06 356.90,139.56 357.47,140.15 C357.65,140.34 357.17,141.08 356.40,141.79 C355.63,142.50 355.00,142.64 355.00,142.10 M 393.00,136.26 C393.00,135.63 393.39,134.88 393.87,134.58 C394.35,134.28 395.01,132.72 395.33,131.10 C395.97,127.91 399.44,126.04 401.28,127.88 C401.88,128.48 402.16,129.09 401.92,129.23 C401.67,129.38 399.56,131.28 397.23,133.45 C394.91,135.63 393.00,136.89 393.00,136.26 M 398.97,130.04 C399.78,129.53 400.14,128.81 399.77,128.44 C399.40,128.06 398.37,128.49 397.48,129.38 C395.72,131.14 396.61,131.53 398.97,130.04 M 381.33,126.58 C381.33,125.95 382.16,125.43 383.17,125.43 C384.18,125.43 385.00,125.73 385.00,126.10 C385.00,126.47 384.18,126.98 383.17,127.25 C382.16,127.51 381.33,127.21 381.33,126.58 M 265.81,673.32 C266.53,673.03 267.40,673.06 267.73,673.40 C268.06,673.73 267.47,673.96 266.42,673.92 C265.25,673.87 265.01,673.64 265.81,673.32 Z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </a>
        }
        title={
          <div className="rounded-full touch-ripple-white bg-base-300">
            <div className="stat flex-wrap">
              <div className="stat-title">Score</div>
              <div className=" text-center">
                {userDetails ? userDetails.score : 0}
              </div>
            </div>
          </div>
        }
        centerTitle={true}
        right={
          <>
            <div
              className="relative mx-2 lg:tooltip"
              data-tip="Notifications"
              ref={popoverRef}
            >
              <Button
                clear={true}
                className="btn btn-circle btn-ghost"
                onClick={() => setPopoverOpened(true)}
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ position: "relative", zIndex: 2 }}
                >
                  <path
                    d="M9.00195 17H5.60636C4.34793 17 3.71872 17 3.58633 16.9023C3.4376 16.7925 3.40126 16.7277 3.38515 16.5436C3.37082 16.3797 3.75646 15.7486 4.52776 14.4866C5.32411 13.1835 6.00031 11.2862 6.00031 8.6C6.00031 7.11479 6.63245 5.69041 7.75766 4.6402C8.88288 3.59 10.409 3 12.0003 3C13.5916 3 15.1177 3.59 16.2429 4.6402C17.3682 5.69041 18.0003 7.11479 18.0003 8.6C18.0003 11.2862 18.6765 13.1835 19.4729 14.4866C20.2441 15.7486 20.6298 16.3797 20.6155 16.5436C20.5994 16.7277 20.563 16.7925 20.4143 16.9023C20.2819 17 19.6527 17 18.3943 17H15.0003M9.00195 17L9.00031 18C9.00031 19.6569 10.3435 21 12.0003 21C13.6572 21 15.0003 19.6569 15.0003 18V17M9.00195 17H15.0003"
                    stroke="#7f8ce8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {notifications.length !== 0 && (
                  <div
                    className="badge badge-primary"
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "-12px",
                      zIndex: 1,
                    }}
                  >
                    {notifications.length}
                  </div>
                )}
              </Button>
              <Popover
                opened={popoverOpened}
                target={popoverRef}
                translucent={false}
                onBackdropClick={() => setPopoverOpened(false)}
              >
                <List>
                  {notifications.map((notification, index) => (
                    <ListItem
                      key={index}
                      title={notification}
                      after={
                        <Button
                          clear={true}
                          onClick={() => handleNotificationDelete(index)}
                          className="btn-circle btn-outline w-5 h-5 min-h-0 min-w-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </Button>
                      }
                    />
                  ))}
                </List>
              </Popover>
            </div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="Button"
                className="btn btn-ghost btn-circle avatar"
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              >
                <div className="w-10 rounded-full">
                  {userDetails?.imageUrl ? (
                    <img alt="User Avatar" src={userDetails.imageUrl} />
                  ) : (
                    <img
                      alt="Default Avatar"
                      src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    />
                  )}
                </div>
              </div>
              <Panel
                side="right"
                opened={isDrawerOpen}
                onBackdropClick={() => setIsDrawerOpen(false)}
              >
                <Page>
                  <Navbar
                    title="Settings"
                    right={
                      <Link navbar onClick={() => setIsDrawerOpen(false)}>
                        Close
                      </Link>
                    }
                  />
                  <div className="h-full flex flex-col">
                    <List>
                      {userDetails && (
                        <ListItem
                          linkComponent={Link}
                          linkProps={{ to: `/profile/${userDetails.id}` }}
                        >
                          <Button clear={true}>
                            <Link to={`/profile/${userDetails.id}`}>
                              Profile
                            </Link>
                          </Button>
                        </ListItem>
                      )}
                      <ListItem>
                        <Button clear={true} onClick={signOutAccount}>
                          Sign Out
                        </Button>
                      </ListItem>
                    </List>
                  </div>
                </Page>
              </Panel>
            </div>
          </>
        }
      ></Navbar>
    </>
  );
};

export default MainNavbar;
