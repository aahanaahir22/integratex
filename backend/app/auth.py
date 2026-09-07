from __future__ import annotations

from typing import Literal

from fastapi import Header, HTTPException
from pydantic import BaseModel


Role = Literal["admin", "developer", "operator", "approver", "auditor"]


class Principal(BaseModel):
    subject: str
    organization_id: str
    role: Role


def current_principal(
    x_demo_subject: str = Header(default="demo-user"),
    x_organization_id: str = Header(default="org_demo"),
    x_demo_role: Role = Header(default="operator"),
) -> Principal:
    """Demo principal seam.

    Production replaces these headers with verified OIDC/JWT claims. Trusting
    identity headers directly is only acceptable in the local zero-key demo.
    """
    return Principal(subject=x_demo_subject, organization_id=x_organization_id, role=x_demo_role)


def require_approver(principal: Principal) -> None:
    if principal.role not in {"admin", "operator", "approver"}:
        raise HTTPException(status_code=403, detail="Approver role required")
