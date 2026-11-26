import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it('does not register forbidden modules in role portals', () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const path of ['/agent/finance', '/agent/reports', '/manager/finance', '/finance/enquiries', '/finance/customers']) {
      expect(router.matchRoutes(path).at(-1)?.routeId).toBe('/$');
    }
  });
  it('registers four separate logins and role homes', () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const role of ['agent', 'manager', 'finance', 'admin']) {
      expect(router.matchRoutes(`/${role}/login`).at(-1)?.routeId).toBe(`/${role}/login`);
      expect(router.matchRoutes(`/${role}`).at(-1)?.routeId).toBe(`/_authenticated/${role}/`);
    }
  });
});
