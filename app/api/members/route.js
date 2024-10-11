import Member from "@/models/Customer";

// GET: Retrieve all members
export async function GET() {
  const members = await Member.find();
  return Response.json(members);
}

// POST: Create a new member
export async function POST(request) {
  const body = await request.json();
  const member = new Member(body);

  await member.save();
  return Response.json(member);
}

export async function PUT(request) {
  const body = await request.json();
  const { _id, ...updateData } = body;
  const member = await Member.findByIdAndUpdate(_id, updateData, { new: true });
  if (!member) {
    return new Response("Member not found", { status: 404 });
  }
  return Response.json(member);
}

// PATCH: Update partial data for an existing member
export async function PATCH(request) {
  const body = await request.json();
  const { _id, ...updateData } = body; // Extract _id and the rest of the fields

  // Check if _id is provided
  if (!_id) {
    return new Response("Member ID is required", { status: 400 });
  }

  // Update the member with the provided _id
  const member = await Member.findByIdAndUpdate(_id, updateData, { new: true });
  if (!member) {
    return new Response("Member not found", { status: 404 });
  }

  // Return the updated member as a JSON response
  return new Response(JSON.stringify(member), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
