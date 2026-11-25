<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Contracts\Bus\CommandClassifier;
use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\CommandType;
use App\Enums\Processes\ShellDialect;
use App\Models\CommandRules\CommandAlias;
use App\Support\Syntax\TreeParser;
use App\Values\Classification;
use App\Values\ExecutionContext;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The owner saves an alias, and saving it again takes the next revision; the alias shows its body, id, revision and
 * purpose.
 */
final class SaveCommandAliasTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_alias_the_owner_saves_shows_its_body_id_revision_and_purpose(): void
    {
        $this->journal->owner();
        $this->artisan(
            'processes:alias-save',
            ['project' => base_path(), 'name' => 'checks', 'line' => 'php artisan test'],
        )
            ->assertSuccessful();
        $this->artisan('processes:alias-save', [
            'project' => base_path(),
            'name' => 'checks',
            'line' => 'php artisan test --compact',
        ])->expectsOutput('Saved. The alias is at revision 2.')->assertSuccessful();
        $alias = CommandAlias::create($this->context()->projectKey(), 'checks');

        $classification = $this->classify('journal run checks');

        $this->assertSame(2, $alias->revision);
        $this->assertSame(CommandType::Verification, $classification->parts[0]->purpose);
        $this->assertTrue($classification->requiredClasses()->contains(CommandClass::Verification));
        $this->assertStringContainsString(
            "alias:checks#{$alias->id}@2",
            $classification->facts()[0]->origin->reference(),
        );
    }

    private function context(): ExecutionContext
    {
        return new ExecutionContext(ShellDialect::Bash, base_path(), base_path());
    }

    private function classify(string $line): Classification
    {
        return $this->app->make(CommandClassifier::class)->classify(
            $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash),
            $this->context(),
        );
    }
}
