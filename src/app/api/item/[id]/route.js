import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const result = await db.collection("item").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(result, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ message: err.toString() }, { status: 400, headers: corsHeaders });
  }
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  try {
    const data = await req.json();
    const client = await getClientPromise();
    const db = client.db("wad-01");
    
    const updateData = {};
    if (data.name) updateData.itemName = data.name;
    if (data.category) updateData.itemCategory = data.category;
    if (data.price) updateData.itemPrice = data.price;

    const result = await db.collection("item").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ message: err.toString() }, { status: 400, headers: corsHeaders });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const result = await db.collection("item").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ message: err.toString() }, { status: 400, headers: corsHeaders });
  }
}