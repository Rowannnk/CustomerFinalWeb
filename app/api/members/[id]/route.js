import Member from "@/models/Customer";

// GET: Retrieve a member by ID
export async function GET(request, { params }) {
  const id = params.id; // Get the member ID from the route parameters
  const member = await Member.findById(id); // Find the member by ID
  if (!member) {
    return new Response("Member not found", { status: 404 });
  }
  return Response.json(member); // Return the found member
}

// DELETE: Remove a member by ID
export async function DELETE(request, { params }) {
  const id = params.id; // Get the member ID from the route parameters
  const member = await Member.findByIdAndDelete(id); // Find and delete the member
  if (!member) {
    return new Response("Member not found", { status: 404 });
  }
  return Response.json(member); // Return the deleted member
}
