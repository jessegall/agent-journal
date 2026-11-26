<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\SaveCommandAlias\SaveCommandAliasCommand;
use App\Contracts\Bus\CommandClassifier;
use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\CommandType;
use App\Enums\Processes\ShellDialect;
use App\Models\CommandRules\CommandAlias;
use App\Models\Projects\Project;
use App\Support\Syntax\TreeParser;
use App\Values\Classification;
use App\Values\ExecutionContext;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The owner saves an alias of a project, the local one unless named, and saving it again takes the next revision;
 * the alias shows its body, id, revision and purpose, and the same name stands in two projects apart.
 */
#[TestsCommand(SaveCommandAliasCommand::class)]
final class SaveCommandAliasTest extends TestCase
{
    use RefreshHookDatabase;

    private const string ALIAS = 'checks';

    public function test_an_alias_the_owner_saves_shows_its_body_id_revision_and_purpose(): void
    {
        $this->journal->owner()->agent('Ada');
        $this->artisan('processes:alias-save', ['name' => self::ALIAS, 'line' => 'php artisan test'])
            ->assertSuccessful();
        $this->artisan('processes:alias-save', ['name' => self::ALIAS, 'line' => 'php artisan test --compact'])
            ->expectsOutput('Saved. The alias is at revision 2.')
            ->assertSuccessful();
        $alias = $this->aliasOf(Project::findLocal());

        $this->journal->actAs('Ada');
        $classification = $this->classify('journal run checks');

        $this->assertSame(2, $alias->revision);
        $this->assertSame(CommandType::Verification, $classification->parts[0]->purpose);
        $this->assertTrue($classification->requiredClasses()->contains(CommandClass::Verification));
        $this->assertStringContainsString(
            "alias:checks#{$alias->id}@2",
            $classification->facts()[0]->origin->reference(),
        );
    }

    public function test_the_same_name_stands_in_two_projects_and_each_agent_gets_its_own(): void
    {
        $this->journal->owner()->project('Shop')->agent('Ada')->agent('Cy', 'main-agent', 'Shop');
        $shop = $this->journal->projectCalled('Shop');
        $this->artisan('processes:alias-save', ['name' => self::ALIAS, 'line' => 'php artisan test'])
            ->assertSuccessful();
        $this->artisan('processes:alias-save', [
            'name' => self::ALIAS,
            'line' => 'php artisan test --compact',
            '--project' => $shop->key,
        ])->assertSuccessful();

        $local = $this->aliasOf(Project::findLocal());
        $other = $this->aliasOf($shop);
        $this->journal->actAs('Cy');

        $this->assertNotSame($local->id, $other->id);
        $this->assertSame([1, 1], [$local->revision, $other->revision]);
        $this->assertStringContainsString(
            "alias:checks#{$other->id}@1",
            $this->classify('journal run checks')->facts()[0]->origin->reference(),
        );
    }

    private function aliasOf(Project $project): CommandAlias
    {
        $alias = CommandAlias::findNamedInProject($project, self::ALIAS);
        $this->assertNotNull($alias);

        return $alias;
    }

    private function classify(string $line): Classification
    {
        return $this->app->make(CommandClassifier::class)->classify(
            $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash),
            new ExecutionContext(ShellDialect::Bash, base_path(), base_path()),
        );
    }
}
