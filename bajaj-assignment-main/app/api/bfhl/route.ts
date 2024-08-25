
import { NextRequest, NextResponse } from 'next/server';

interface BFHLRequest {
  data: string[];
}

interface BFHLResponse {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_lowercase_alphabet: string[];
}

const USER_ID = "john_doe_17091999";
const EMAIL = "aditya.thakur2021@vitbbopal.ac.in";
const ROLL_NUMBER = "21BCE10620";

const extractData = (data: string[]) => {
  const numbers: string[] = [];
  const alphabets: string[] = [];
  let highestLowercase: string | null = null;

  data.forEach((item) => {
    if (!isNaN(Number(item)) && item.trim() !== '') {
      numbers.push(item);
    } else if (/^[A-Za-z]$/.test(item)) {
      alphabets.push(item);
      if (/^[a-z]$/.test(item)) {
        if (!highestLowercase || item > highestLowercase) {
          highestLowercase = item;
        }
      }
    }
  });

  return {
    numbers,
    alphabets,
    highestLowercaseAlphabet: highestLowercase ? [highestLowercase] : [],
  };
};

export async function GET() {
  return NextResponse.json({ operation_code: 1 });
}

export async function POST(req: NextRequest) {
  try {
    const body: BFHLRequest = await req.json();

    if (!Array.isArray(body.data) || body.data.some(item => typeof item !== 'string')) {
      return NextResponse.json(
        { is_success: false, error: 'Invalid data format' },
        { status: 400 }
      );
    }

    const { numbers, alphabets, highestLowercaseAlphabet } = extractData(body.data);

    const response: BFHLResponse = {
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { is_success: false, error: 'Invalid request format or server error' },
      { status: 400 }
    );
  }
}

