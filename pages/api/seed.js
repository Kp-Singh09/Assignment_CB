import dbConnect from "../../lib/dbConnect";
import Concern from "../../models/Concern";
import Treatment from "../../models/Treatment";
import ConcernTreatment from "../../models/ConcernTreatment";
import Package from "../../models/Package";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    // --- UPDATED: concernData is now an array of objects with synonyms ---
    const concernData = [
      { name: "acne scars", synonyms: ["pimples", "scarring", "blemishes"] },
      { name: "dark circles", synonyms: ["under eye bags", "panda eyes"] },
      { name: "double chin", synonyms: ["chin fat", "submental fat"] },
      { name: "fine lines & wrinkles", synonyms: ["wrinkles", "aging lines", "crows feet"] },
      { name: "dull skin", synonyms: ["lifeless skin", "tired skin"] },
      { name: "uneven skin tone", synonyms: ["pigmentation", "dark spots"] },
      { name: "hair loss", synonyms: ["hair fall", "thinning hair", "baldness"] },
      { name: "sun damage", synonyms: ["sun spots", "photoaging"] },
      { name: "large pores", synonyms: ["open pores"] },
      { name: "unwanted hair", synonyms: ["hair removal"] },
    ];

    const treatmentData = [
      "Microneedling",
      "Chemical Peel",
      "Laser Resurfacing",
      "Under-eye Filler",
      "PRP Under-eye",
      "HIFU",
      "Kybella",
      "Botox",
      "Dermal Fillers",
      "HydraFacial",
      "Vampire Facial",
      "IPL Photofacial",
      "Laser Hair Removal",
      "PRP Hair Treatment",
      "Fractional CO2 Laser",
      "Q-Switch Laser",
    ];

    const clinicNames = [
      "The Glow Up Clinic",
      "Aura Aesthetics",
      "Skin & Sculpt",
      "Evolve Medispa",
      "Radiance Wellness",
      "Derma Revive",
      "The Youth Fountain",
      "Prestige Cosmetics",
      "City Skin Clinic",
      "Luxe Laser Lounge",
    ];

    await Concern.deleteMany({});
    await Treatment.deleteMany({});
    await ConcernTreatment.deleteMany({});
    await Package.deleteMany({});
    console.log("Old data cleared");

    // --- UPDATED: Directly insert the concernData array of objects ---
    const concerns = await Concern.insertMany(concernData);
    console.log("Concerns inserted:", concerns.length);

    const treatments = await Treatment.insertMany(
      treatmentData.map((name) => ({ name }))
    );
    console.log("Treatments inserted:", treatments.length);

    const concernMap = Object.fromEntries(concerns.map((c) => [c.name, c._id]));
    const treatmentMap = Object.fromEntries(
      treatments.map((t) => [t.name, t._id])
    );

    const mapping = [
      ["acne scars", ["Microneedling", "Chemical Peel", "Laser Resurfacing", "Fractional CO2 Laser"]],
      ["dark circles", ["Under-eye Filler", "PRP Under-eye", "Chemical Peel"]],
      ["double chin", ["HIFU", "Kybella"]],
      ["fine lines & wrinkles", ["Botox", "Dermal Fillers", "Microneedling", "Laser Resurfacing"]],
      ["dull skin", ["HydraFacial", "Chemical Peel", "Vampire Facial"]],
      ["uneven skin tone", ["IPL Photofacial", "Q-Switch Laser", "Chemical Peel"]],
      ["hair loss", ["PRP Hair Treatment"]],
      ["sun damage", ["IPL Photofacial", "Laser Resurfacing", "Chemical Peel"]],
      ["large pores", ["Microneedling", "HydraFacial", "Chemical Peel"]],
      ["unwanted hair", ["Laser Hair Removal"]],
    ];

    let concernTreatments = [];
    mapping.forEach(([concern, treatList]) => {
      treatList.forEach((treatName) => {
        if (concernMap[concern] && treatmentMap[treatName]) {
          concernTreatments.push({
            concern: concernMap[concern],
            treatment: treatmentMap[treatName],
          });
        }
      });
    });

    await ConcernTreatment.insertMany(concernTreatments);
    console.log("Mappings inserted:", concernTreatments.length);

    const packagesData = [
      { clinic_name: clinicNames[0], package_name: "Microneedling Starter Pack", treatment: "Microneedling", price: 6000 },
      { clinic_name: clinicNames[1], package_name: "Advanced Scar Revision (Microneedling)", treatment: "Microneedling", price: 7500 },
      { clinic_name: clinicNames[2], package_name: "Deep Chemical Peel for Scars", treatment: "Chemical Peel", price: 5500 },
      { clinic_name: clinicNames[3], package_name: "Fractional CO2 Laser Session", treatment: "Fractional CO2 Laser", price: 15000 },
      { clinic_name: clinicNames[4], package_name: "Full Face Laser Resurfacing", treatment: "Laser Resurfacing", price: 12000 },
      { clinic_name: clinicNames[5], package_name: "Under-eye Filler Special", treatment: "Under-eye Filler", price: 18000 },
      { clinic_name: clinicNames[6], package_name: "PRP Under-eye Rejuvenation", treatment: "PRP Under-eye", price: 9000 },
      { clinic_name: clinicNames[0], package_name: "Bright Eyes Peel", treatment: "Chemical Peel", price: 4000 },
      { clinic_name: clinicNames[7], package_name: "HIFU Chin Sculpting", treatment: "HIFU", price: 25000 },
      { clinic_name: clinicNames[8], package_name: "Kybella Fat Dissolving Injections", treatment: "Kybella", price: 40000 },
      { clinic_name: clinicNames[1], package_name: "Jawline Contour (HIFU)", treatment: "HIFU", price: 28000 },
      { clinic_name: clinicNames[9], package_name: "Forehead & Crows Feet Botox", treatment: "Botox", price: 16000 },
      { clinic_name: clinicNames[2], package_name: "Full Face Dermal Fillers", treatment: "Dermal Fillers", price: 35000 },
      { clinic_name: clinicNames[3], package_name: "Anti-Aging Microneedling", treatment: "Microneedling", price: 8000 },
      { clinic_name: clinicNames[4], package_name: "Signature HydraFacial Experience", treatment: "HydraFacial", price: 7000 },
      { clinic_name: clinicNames[5], package_name: "Vampire Facial (PRP)", treatment: "Vampire Facial", price: 11000 },
      { clinic_name: clinicNames[6], package_name: "Party Glow Chemical Peel", treatment: "Chemical Peel", price: 4500 },
      { clinic_name: clinicNames[7], package_name: "IPL Photofacial for Pigmentation", treatment: "IPL Photofacial", price: 9500 },
      { clinic_name: clinicNames[8], package_name: "Q-Switch Laser Toning", treatment: "Q-Switch Laser", price: 6500 },
      { clinic_name: clinicNames[9], package_name: "PRP Hair Growth Therapy (3 Sessions)", treatment: "PRP Hair Treatment", price: 22000 },
      { clinic_name: clinicNames[0], package_name: "Scalp Health PRP Boost", treatment: "PRP Hair Treatment", price: 8500 },
      { clinic_name: clinicNames[1], package_name: "Sun Damage Repair (IPL)", treatment: "IPL Photofacial", price: 10000 },
      { clinic_name: clinicNames[2], package_name: "Total Resurfacing for Sun Damage", treatment: "Laser Resurfacing", price: 14000 },
      { clinic_name: clinicNames[3], package_name: "Pore Minimizing HydraFacial", treatment: "HydraFacial", price: 7500 },
      { clinic_name: clinicNames[4], package_name: "Pore Refiner Peel", treatment: "Chemical Peel", price: 5000 },
      { clinic_name: clinicNames[5], package_name: "Full Body Laser Hair Removal", treatment: "Laser Hair Removal", price: 50000 },
      { clinic_name: clinicNames[6], package_name: "Underarm Laser Package (6 Sessions)", treatment: "Laser Hair Removal", price: 15000 },
    ];

    const packagesToInsert = packagesData.map(p => ({
      ...p,
      treatment: treatmentMap[p.treatment],
    }));

    const packages = await Package.insertMany(packagesToInsert);
    console.log("Packages inserted:", packages.length);

    console.log("SEEDING COMPLETE!");
    return res.status(200).json({
      success: true,
      message: "Database seeded successfully with expanded data",
      counts: {
        concerns: concerns.length,
        treatments: treatments.length,
        mappings: concernTreatments.length,
        packages: packages.length
      }
    });

  } catch (error) {
    console.error("Seeding error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}