/* ============================================================================
   ALTERNATIVE TEST SETS  (development only - never shipped to the browser)

   Each question needs more than one case, or a candidate could pass by
   printing the expected answer as a literal. Vary the input, the file, or
   the seeded data, and hardcoding fails immediately.

   inputs : extra INPUT streams
   files  : extra virtual file contents
   setup  : extra seeding code, replacing run.setup
   ========================================================================== */
export const ALT = {

/* ---- harness variation: call the candidate's subroutine differently ---- */
Q13:{ harness:['OUTPUT CountChar("Mississippi", \'s\')\nOUTPUT CountChar("", \'a\')',
               'OUTPUT CountChar("AARDVARK", \'A\')'] },
Q14:{ harness:['OUTPUT IsPalindrome("Racecar")\nOUTPUT IsPalindrome("abcd")',
               'OUTPUT IsPalindrome("a")\nOUTPUT IsPalindrome("")'] },
Q17:{ harness:["OUTPUT LargestOfThree(1.0, 2.0, 3.0)\nOUTPUT LargestOfThree(9.5, 2.0, 3.0)",
               "OUTPUT LargestOfThree(-4.0, -9.0, -1.0)"] },
Q29:{ harness:["OUTPUT Power(3.0, 4)\nOUTPUT Power(5.0, 0)",
               "OUTPUT Power(2.0, 10)"] },
Q30:{ harness:["CALL Push(7)\nOUTPUT Pop()\nOUTPUT Pop()",
               "OUTPUT Pop()\nCALL Push(1)\nCALL Push(2)\nOUTPUT Pop()\nOUTPUT Pop()\nOUTPUT Pop()"] },
Q31:{ harness:["OUTPUT BinarySearch(3)\nOUTPUT BinarySearch(2997)\nOUTPUT BinarySearch(4)"] },
Q27:{ harness:['DECLARE T2 : Thermostat\nT2 <- NEW Thermostat("Kitchen", 18.0)\nOUTPUT T2.GetTarget()\nCALL T2.SetTarget(4.0)\nOUTPUT T2.GetTarget()\nOUTPUT T2.ShouldHeat(25.0)'] },
Q28:{ harness:['DECLARE M2 : Manager\nM2 <- NEW Manager("Kim", 40000.00, 0.0)\nOUTPUT M2.GetTotalPay()'] },
I20:{ harness:["OUTPUT Larger(-5, -2)\nOUTPUT Larger(4, 4)"] },
T03:{ harness:['DECLARE P2 : Playlist\nP2 <- NEW Playlist("Empty")\nOUTPUT P2.GetCount(), " ", P2.AverageLength()\nCALL P2.AddTrack(100)\nOUTPUT P2.GetCount(), " ", P2.AverageLength()'] },
T04:{ harness:["DECLARE B2 : Motorbike\nB2 <- NEW Motorbike(125)\nOUTPUT B2.Describe()\nOUTPUT B2.GetWheels()"] },
T05:{ harness:['OUTPUT Dequeue()\nCALL Enqueue("x")\nCALL Enqueue("y")\nOUTPUT Dequeue()\nOUTPUT Dequeue()\nOUTPUT Dequeue()'] },
T06:{ harness:["DECLARE Cur : INTEGER\nCALL InsertInOrder(5)\nCALL InsertInOrder(1)\nCALL InsertInOrder(9)\nCALL InsertInOrder(5)\nCur <- StartPointer\nWHILE Cur <> 0 DO\n    OUTPUT Nodes[Cur].Data\n    Cur <- Nodes[Cur].Pointer\nENDWHILE"] },
T07:{ harness:["OUTPUT BSearch(4, 1, 100)\nOUTPUT BSearch(400, 1, 100)\nOUTPUT BSearch(7, 1, 100)"] },


/* ---- inputs ---- */
Q02:{ inputs:["90061","59","3600"] },
Q03:{ inputs:["0.5","35.0","2.0","-1"] },
Q04:{ inputs:["1","9","7"] },
Q06:{ inputs:["101\n0","55","-7\n100"] },
Q07:{ inputs:["-1","5.00\n-1","1.25\n2.50\n3.75\n-1"] },
Q22:{ inputs:["51\n51\n51\n51\n51\n51\n51\n51\n51\n51","1\n2\n3\n4\n5\n6\n7\n8\n9\n10"] },
I03:{ inputs:["3600","59","61"] },
I04:{ inputs:["0","7","-9"] },
I05:{ inputs:["1275","900","5"] },
I06:{ inputs:["70","39","55","100"] },
I07:{ inputs:["9","4","1"] },
I08:{ inputs:["3\nFALSE","70\nTRUE","16\nFALSE","5\nTRUE"] },
I09:{ inputs:["3","12"] },
I10:{ inputs:["9999","55\n1000","0\n123\n4821"] },
I11:{ inputs:["-1","5.00\n-1","1.10\n2.20\n-1"] },
I17:{ inputs:["Mississippi\ns","abc\nz","AARDVARK\na"] },
I18:{ inputs:["Racecar","pseudocode","a"] },
I19:{ inputs:["ab1234","AB123","ZZ9999","AB12C4"] },
I27:{ inputs:["51\n51\n51\n51\n51","1\n2\n3\n4\n5"] },
S01:{ inputs:["2000","2024","2023","2100"] },
S02:{ inputs:["10000","30000","50000","120000"] },
S06:{ inputs:["Lovelace, Ada","Turing, Alan"] },

/* ---- files ---- */
Q23:{ files:[[{name:"Log.txt",lines:[]}],
             [{name:"Log.txt",lines:["ERROR one","ERROR two"]}],
             [{name:"Log.txt",lines:["INFO fine","WARN hmm"]}]] },
Q24:{ inputs:["Amara Okafor","Zoe Blake"] },
I22:{ files:[[{name:"Log.txt",lines:[]}],
             [{name:"Log.txt",lines:["only one line"]}]] },
S08:{ files:[[{name:"Marks.txt",lines:["A,10","B,20"]}],
             [{name:"Marks.txt",lines:["A,100","B,99","C,50"]}]] },

/* ---- seeded data ---- */
Q08:{ setup:["DECLARE Rainfall : ARRAY[1:12] OF REAL\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 12\n    Rainfall[Seed] <- 100 - Seed * 3.25\nNEXT Seed",
             "DECLARE Rainfall : ARRAY[1:12] OF REAL\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 12\n    Rainfall[Seed] <- 5.0\nNEXT Seed"] },
Q09:{ setup:["DECLARE Scores : ARRAY[1:40] OF INTEGER\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 40\n    Scores[Seed] <- 0 - Seed\nNEXT Seed",
             "DECLARE Scores : ARRAY[1:40] OF INTEGER\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 40\n    Scores[Seed] <- MOD(Seed * 31, 97)\nNEXT Seed"] },
Q10:{ setup:["DECLARE Members : ARRAY[1:200] OF STRING\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 200\n    Members[Seed] <- \"Person\" & NUM_TO_STRING(201 - Seed)\nNEXT Seed"] },
Q11:{ setup:["DECLARE Prices : ARRAY[1:50] OF REAL\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 50\n    Prices[Seed] <- Seed * 1.5\nNEXT Seed",
             "DECLARE Prices : ARRAY[1:50] OF REAL\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 50\n    Prices[Seed] <- 51.0 - Seed\nNEXT Seed"] },
Q12:{ setup:["DECLARE Sales : ARRAY[1:5, 1:12] OF REAL\nDECLARE R : INTEGER\nDECLARE C : INTEGER\nFOR R <- 1 TO 5\n    FOR C <- 1 TO 12\n        Sales[R, C] <- R + C\n    NEXT C\nNEXT R"] },
Q26:{ setup:["TYPE Booking\n    DECLARE BookingRef   : STRING\n    DECLARE CustomerName : STRING\n    DECLARE FilmTitle    : STRING\n    DECLARE SeatCount    : INTEGER\n    DECLARE TotalPrice   : REAL\n    DECLARE Paid         : BOOLEAN\nENDTYPE\n\nDECLARE Bookings : ARRAY[1:1000] OF Booking\nDECLARE BookingCount : INTEGER\nDECLARE Seed : INTEGER\n\nBookingCount <- 3\nFOR Seed <- 1 TO BookingCount\n    Bookings[Seed].BookingRef   <- \"XX\" & NUM_TO_STRING(Seed)\n    Bookings[Seed].CustomerName <- \"C\" & NUM_TO_STRING(Seed)\n    Bookings[Seed].FilmTitle    <- \"F\"\n    Bookings[Seed].SeatCount    <- Seed\n    Bookings[Seed].TotalPrice   <- Seed * 10.0\n    Bookings[Seed].Paid         <- FALSE\nNEXT Seed"] },
Q31:{ setup:["DECLARE Sorted : ARRAY[1:1000] OF INTEGER\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 1000\n    Sorted[Seed] <- Seed\nNEXT Seed"] },
Q32:{ setup:["TYPE TNode\n    DECLARE Data    : INTEGER\n    DECLARE Pointer : INTEGER\nENDTYPE\n\nDECLARE Nodes : ARRAY[1:200] OF TNode\nDECLARE StartPointer : INTEGER\nStartPointer <- 0"] },
I13:{ setup:["DECLARE Rainfall : ARRAY[1:12] OF REAL\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 12\n    Rainfall[Seed] <- 60 - Seed * 2.5\nNEXT Seed",
             "DECLARE Rainfall : ARRAY[1:12] OF REAL\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 12\n    Rainfall[Seed] <- 9.0\nNEXT Seed"] },
I14:{ setup:["DECLARE Scores : ARRAY[1:20] OF INTEGER\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 20\n    Scores[Seed] <- 0 - Seed\nNEXT Seed",
             "DECLARE Scores : ARRAY[1:20] OF INTEGER\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 20\n    Scores[Seed] <- MOD(Seed * 13, 41)\nNEXT Seed"] },
I15:{ setup:["DECLARE Names : ARRAY[1:30] OF STRING\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 30\n    Names[Seed] <- \"Kid\" & NUM_TO_STRING(31 - Seed)\nNEXT Seed"], inputs:["Kid3","Nobody"] },
I16:{ setup:["DECLARE Sales : ARRAY[1:4, 1:7] OF INTEGER\nDECLARE R, C : INTEGER\nFOR R <- 1 TO 4\n    FOR C <- 1 TO 7\n        Sales[R, C] <- R * C\n    NEXT C\nNEXT R"] },
I23:{ setup:["DECLARE Register : ARRAY[1:20] OF STRING\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 20\n    Register[Seed] <- \"Sam\" & NUM_TO_STRING(Seed)\nNEXT Seed",
             "DECLARE Register : ARRAY[1:20] OF STRING\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 20\n    Register[Seed] <- \"Bob\" & NUM_TO_STRING(Seed)\nNEXT Seed"] },
S04:{ setup:["DECLARE Names : ARRAY[1:10] OF STRING\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 10\n    Names[Seed] <- CHR(64 + Seed) & \"x\"\nNEXT Seed"] },
S05:{ setup:["DECLARE A, B : ARRAY[1:5] OF INTEGER\nDECLARE C : ARRAY[1:10] OF INTEGER\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 5\n    A[Seed] <- Seed\n    B[Seed] <- Seed + 100\nNEXT Seed"] },
T02:{ setup:["TYPE Member\n    DECLARE MemberNo  : INTEGER\n    DECLARE Name      : STRING\n    DECLARE JoinMonth : INTEGER\n    DECLARE Fee       : REAL\n    DECLARE UpToDate  : BOOLEAN\nENDTYPE\n\nDECLARE Members : ARRAY[1:200] OF Member\nDECLARE MemberCount, Seed : INTEGER\n\nMemberCount <- 3\nFOR Seed <- 1 TO MemberCount\n    Members[Seed].MemberNo  <- Seed\n    Members[Seed].Name      <- \"M\" & NUM_TO_STRING(Seed)\n    Members[Seed].JoinMonth <- 13 - Seed\n    Members[Seed].Fee       <- 10.0\n    Members[Seed].UpToDate  <- TRUE\nNEXT Seed"] },
T09:{ setup:["DECLARE Values : ARRAY[1:20] OF INTEGER\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 20\n    Values[Seed] <- Seed\nNEXT Seed",
             "DECLARE Values : ARRAY[1:20] OF INTEGER\nDECLARE Seed : INTEGER\nFOR Seed <- 1 TO 20\n    Values[Seed] <- 21 - Seed\nNEXT Seed"] }
};
