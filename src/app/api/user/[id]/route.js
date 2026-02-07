import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const result = await db
      .collection("user")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    return NextResponse.json(result, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders },
    );
  }
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  try {
    const data = await req.json();
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const updateData = {};
    if (data.firstname) updateData.firstname = data.firstname;
    if (data.lastname) updateData.lastname = data.lastname;
    if (data.email) updateData.email = data.email;
    if (data.status) updateData.status = data.status;
    if (data.role) updateData.role = data.role;
    if (data.username) updateData.username = data.username;

    // Handle password update if provided (hashing it)
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const result = await db
      .collection("user")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders },
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const result = await db
      .collection("user")
      .deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders },
    );
  }
}
