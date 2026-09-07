from __future__ import annotations

import os

from pydantic import BaseModel, Field


class AIInterpretation(BaseModel):
    workflow_name: str = Field(max_length=80)
    summary: str = Field(max_length=280)
    detected_systems: list[str] = Field(max_length=10)
    clarification_required: bool
    clarification_question: str | None = Field(default=None, max_length=240)


async def interpret_prompt(prompt: str) -> AIInterpretation | None:
    """Optional provider enrichment.

    This function is off by default so the public demo never needs a private
    key. Even when enabled, its output can only change explanatory fields; the
    deterministic compiler still creates and validates executable nodes.
    """
    enabled = os.getenv("INTEGRATEX_USE_LLM", "false").lower() == "true"
    if not enabled or not os.getenv("OPENAI_API_KEY"):
        return None

    try:
        from openai import AsyncOpenAI
    except ImportError:
        return None

    client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = await client.responses.parse(
        model=os.getenv("OPENAI_MODEL", "gpt-5-mini"),
        input=[
            {
                "role": "system",
                "content": "Interpret the requested API integration. Never invent credentials, connector capabilities, evidence, or execution results. Return only explanatory metadata; deterministic code will compile and validate the executable workflow.",
            },
            {"role": "user", "content": prompt},
        ],
        text_format=AIInterpretation,
    )
    return response.output_parsed
