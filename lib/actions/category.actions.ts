'use server';
import { NextResponse } from "next/server";

import { CreateCategoryParams } from "@/types";
import { handleError } from "@/lib/utils";
import { connectToDatabase } from "@/lib/database";
import Category from "@/lib/database/models/category.model";

export const createCategory = async ({ categoryName }: CreateCategoryParams) => {
  try {
    await connectToDatabase();

    const newCategory = await Category.create({ name: categoryName });

    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) { handleError(error); }
};

export const getAllCategories = async () => {
  try {
    await connectToDatabase();

    const categories = await Category.find({});

    return JSON.parse(JSON.stringify(categories));
  } catch (error) { handleError(error); }
};

export const getCategoryById = async (categoryId: string) => {
  try {
    await connectToDatabase();

    const category = await Category.findById(categoryId);
    if (!category) return new NextResponse('Not found', { status: 404 });

    return JSON.parse(JSON.stringify(category));
  } catch (error) { handleError(error); }
};
