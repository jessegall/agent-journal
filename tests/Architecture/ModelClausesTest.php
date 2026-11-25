<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A model writes a query clause (a where, an order, a when, a join) only inside a named scope or a relation; its other
 * methods chain scopes and end the query. tools/refactoring/model-clauses.php lists every other.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every PHP file of app and domain.')]
final class ModelClausesTest extends TestCase
{
    private const string HOW_TO_FIX = 'Name each clause as a scope under Scopes and chain it: ';

    private const string FIXTURE = 'tests/Fixtures/ModelClauses/WhereOutsideAScope.php';

    public function test_every_model_writes_its_clauses_only_in_scopes_and_relations(): void
    {
        $output = $this->checkOutput('app', 'domain');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_a_clause_outside_a_scope_is_listed_and_the_scope_is_not(): void
    {
        $output = $this->checkOutput(self::FIXTURE);

        $this->assertStringContainsString(self::FIXTURE.':20', $output);
        $this->assertStringNotContainsString(self::FIXTURE.':31', $output);
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/model-clauses.php', ...$paths], base_path());
        $check->run();

        return $check->getOutput();
    }
}
