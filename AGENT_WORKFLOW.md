# AI Agent Workflow Log

## Agents Used

This project was developed using **Cursor Agent** (Claude-powered AI assistant integrated into Cursor IDE) for code generation, refactoring, and architectural guidance.

## Prompts & Outputs

### Example 1: Backend Domain Entity Creation

**Prompt:**
```
Create a ComplianceBalance entity class following hexagonal architecture principles. 
It should calculate compliance balance using the formula:
CB = (Target - Actual) × Energy in scope
where Energy in scope = fuelConsumption × 41,000 MJ/t
Target intensity for 2025 is 89.3368 gCO₂e/MJ
```

**Generated Code:**
```typescript
export class ComplianceBalance {
  private static readonly ENERGY_CONVERSION_FACTOR = 41000;
  private static readonly TARGET_INTENSITY_2025 = 89.3368;

  static calculate(
    targetIntensity: number,
    actualIntensity: number,
    fuelConsumption: number
  ): number {
    const energyInScope = fuelConsumption * ComplianceBalance.ENERGY_CONVERSION_FACTOR;
    const cb = (targetIntensity - actualIntensity) * energyInScope;
    return cb;
  }
  // ... rest of implementation
}
```

**Validation:**
- ✅ Formula matches specification
- ✅ Constants properly defined
- ✅ Static methods for calculations
- ✅ Domain logic isolated from infrastructure

### Example 2: Use Case Implementation

**Prompt:**
```
Implement CreatePoolUseCase with greedy allocation algorithm:
- Sort members by CB descending (surplus first)
- Transfer surplus to deficits
- Validate: Sum(adjustedCB) ≥ 0
- Deficit ship cannot exit worse
- Surplus ship cannot exit negative
```

**Generated Code:**
The agent generated a comprehensive `CreatePoolUseCase` class with:
- Greedy allocation logic
- Validation rules
- Proper error handling
- Member allocation algorithm

**Refinements Made:**
- Fixed edge case where surplus could go negative
- Added validation before pool creation
- Improved allocation algorithm efficiency

### Example 3: Frontend Component Generation

**Prompt:**
```
Create a RoutesTab React component with:
- Table displaying routes
- Filters for vesselType, fuelType, year
- "Set Baseline" button
- TypeScript strict mode
- TailwindCSS styling
```

**Generated Output:**
- Complete React functional component
- TypeScript interfaces
- Filter state management
- API integration
- Responsive table layout

**Corrections:**
- Fixed API endpoint URLs
- Added loading states
- Improved error handling
- Enhanced UI/UX

### Example 4: Database Schema Design

**Prompt:**
```
Design Prisma schema for FuelEU Maritime compliance platform with:
- routes table
- ship_compliance table
- bank_entries table
- pools and pool_members tables
Include proper relationships and indexes
```

**Generated Schema:**
The agent created a complete Prisma schema with:
- All required tables
- Proper relationships (Pool → PoolMembers)
- Unique constraints
- Indexes for performance
- Appropriate field types

**Validation:**
- ✅ All required fields present
- ✅ Relationships correctly defined
- ✅ Constraints properly set
- ✅ Seed data compatible

## Validation / Corrections

### 1. Banking Logic Correction

**Issue:** Initial implementation didn't properly track applied amounts separately from banked amounts.

**Prompt:**
```
Fix the banking repository to track applied amounts. Applied amounts should reduce available banked amount.
```

**Correction:**
- Implemented negative entries to represent applications
- Updated `getAvailableBanked()` to subtract applied from banked
- Added `recordApplication()` helper method

### 2. Pool Allocation Algorithm Fix

**Issue:** Initial greedy algorithm could leave some deficits unaddressed.

**Prompt:**
```
Refine the greedy allocation to ensure all deficits are addressed before surpluses are fully depleted.
```

**Correction:**
- Improved loop logic to prioritize worst deficits
- Added check to ensure surpluses aren't over-allocated
- Fixed edge cases with zero CB ships

### 3. Frontend API Integration

**Issue:** API base URL wasn't consistent across services.

**Prompt:**
```
Ensure all API services use consistent base URL and error handling.
```

**Correction:**
- Created shared constant for API base URL
- Standardized error handling in all services
- Added proper TypeScript types for responses

### 4. Compliance Balance Calculation

**Issue:** Target intensity was hardcoded instead of being configurable by year.

**Prompt:**
```
Make target intensity year-aware, but default to 89.3368 for 2025+.
```

**Correction:**
- Added `getTargetIntensity(year)` method
- Maintained backward compatibility
- Made it easy to extend for future years

## Observations

### Where Agent Saved Time

1. **Boilerplate Generation** - Quickly generated repository implementations, controllers, and routes
2. **Type Safety** - Generated TypeScript interfaces and types throughout
3. **Architecture Consistency** - Maintained hexagonal architecture patterns consistently
4. **Database Schema** - Generated complete Prisma schema with relationships
5. **React Components** - Generated functional components with hooks and state management

### Where It Failed or Hallucinated

1. **API Endpoints** - Sometimes generated incorrect endpoint paths (fixed by careful review)
2. **Business Logic Details** - Needed refinement for edge cases (pooling rules, banking constraints)
3. **Database Relationships** - Initial schema needed adjustment for unique constraints
4. **Error Messages** - Generic error messages needed to be more specific

### How Tools Were Combined Effectively

1. **Cursor Agent + Manual Review:**
   - Agent generated structure and boilerplate
   - Manual review ensured business logic correctness
   - Refined prompts iteratively for better output

2. **Incremental Development:**
   - Started with domain layer (core entities)
   - Built outward to adapters
   - Tested each layer before moving to next

3. **Code Generation → Refactoring:**
   - Generated initial implementation
   - Refactored for clarity and maintainability
   - Added edge case handling

## Best Practices Followed

### 1. Prompt Engineering

**Effective Prompts:**
- ✅ Clear, specific requirements
- ✅ Included context (architecture, patterns)
- ✅ Specified expected output format
- ✅ Mentioned constraints and rules

**Example:**
```
Create a Prisma repository implementing RouteRepository interface.
It should map Prisma models to domain entities and handle all CRUD operations.
Use the existing Prisma client instance from infrastructure/db/prismaClient.
```

### 2. Incremental Development

- Built one layer at a time (domain → application → adapters)
- Validated each component before integration
- Tested API endpoints after controller implementation

### 3. Code Review Process

- Generated code reviewed for:
  - Business logic correctness
  - Type safety
  - Error handling
  - Performance considerations

### 4. Refinement Strategy

- Start with working implementation
- Refine for edge cases
- Optimize for readability
- Add comprehensive error handling

### 5. Documentation First

- Used prompts to generate documentation alongside code
- Kept documentation in sync with implementation
- Documented architectural decisions

## Example Workflow

### Creating a New Feature (Banking)

1. **Domain Layer Prompt:**
   ```
   Create BankEntry domain entity for banking surplus compliance balance.
   Include: id, shipId, year, amountGco2eq, createdAt
   ```

2. **Port Interface Prompt:**
   ```
   Create BankingRepository interface with methods:
   - save(entry)
   - findByShipAndYear()
   - getTotalBanked()
   - getAvailableBanked()
   ```

3. **Use Case Prompt:**
   ```
   Implement BankSurplusUseCase that:
   - Validates CB is positive
   - Creates bank entry
   - Saves to repository
   ```

4. **Adapter Implementation:**
   ```
   Implement PrismaBankingRepository with all methods from interface.
   Use Prisma client for database operations.
   ```

5. **Controller & Routes:**
   ```
   Create BankingController and Express routes for banking endpoints.
   Include error handling and proper HTTP status codes.
   ```

6. **Frontend Component:**
   ```
   Create BankingTab React component with:
   - Display current CB
   - Bank surplus button
   - Apply banked form
   - KPIs display
   ```

## Lessons Learned

1. **Be Specific** - Vague prompts lead to generic solutions
2. **Iterate** - First output is rarely perfect; refine iteratively
3. **Validate** - Always check business logic correctness
4. **Context Matters** - Include architecture context in prompts
5. **Test Early** - Validate each layer before building next

## Efficiency Gains

### Time Saved

- **Domain Entities:** ~2 hours → 15 minutes (8x faster)
- **Repository Implementations:** ~3 hours → 30 minutes (6x faster)
- **React Components:** ~4 hours → 1 hour (4x faster)
- **API Routes:** ~2 hours → 30 minutes (4x faster)

### Overall Impact

- **Total Development Time:** Estimated 40 hours → ~12 hours
- **Efficiency Gain:** ~70% time reduction
- **Code Quality:** Consistent architecture, type safety, error handling

---

**Conclusion:** AI agents (specifically Cursor Agent) significantly accelerated development while maintaining code quality through proper architecture patterns and iterative refinement.

