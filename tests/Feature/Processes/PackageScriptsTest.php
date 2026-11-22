<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Contracts\Bus\CommandClassifier;
use App\Enums\CommandClass;
use App\Enums\CommandType;
use App\Enums\ShellDialect;
use App\Support\PackageScripts;
use App\Support\Syntax\TreeParser;
use App\Values\Classification;
use App\Values\ExecutionContext;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A composer or npm script is classified by what its body runs, never by its name (doc 21 revision 6, sections 67 and
 * 68; stories 143-147).
 */
final class PackageScriptsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_composer_lint_is_the_pint_fix_as_tests_and_checks_with_edit(): void
    {
        $classification = $this->classify('composer lint', base_path());

        $this->assertSame(
            [CommandClass::Read, CommandClass::Edit, CommandClass::Verification],
            $classification->requiredClasses()->classes,
        );
        $this->assertSame(CommandType::Verification, $classification->parts[0]->purpose);
    }

    public function test_the_inside_test_chain_joins_every_child_with_its_contract(): void
    {
        $classification = $this->classify('composer test:inside', base_path());

        $this->assertTrue($classification->isKnown());
        $this->assertTrue($classification->requiredClasses()->contains(CommandClass::Verification));
        $this->assertTrue($classification->requiredClasses()->contains(CommandClass::Delete));
        $this->assertCount(4, $classification->parts[0]->contracts);
        $this->assertStringContainsString(
            'script:composer.json#test:inside@',
            $classification->facts()[0]->origin->reference(),
        );
    }

    public function test_a_script_named_check_that_deletes_is_a_delete_and_no_check(): void
    {
        $root = $this->project(['check' => 'rm -rf build']);

        $classification = $this->classify('npm run check', $root);

        $this->assertSame([CommandClass::Delete], $classification->requiredClasses()->classes);
        $this->assertSame(CommandType::Ordinary, $classification->parts[0]->purpose);
    }

    public function test_a_changed_body_gives_a_new_digest(): void
    {
        $before = $this->app->make(PackageScripts::class)->bodyOf(
            'npm',
            'check',
            $this->project(['check' => 'vp check']),
        )[0]->binding->digest;
        $after = $this->app->make(PackageScripts::class)->bodyOf(
            'npm',
            'check',
            $this->project(['check' => 'vp check --fix']),
        )[0]->binding->digest;

        $this->assertNotSame($before, $after);
    }

    /**
     * @param  array<string, string>  $scripts
     */
    private function project(array $scripts): string
    {
        $root = sys_get_temp_dir().'/package-scripts-'.md5(json_encode($scripts, JSON_THROW_ON_ERROR));
        @mkdir($root);
        file_put_contents("{$root}/package.json", json_encode(['scripts' => $scripts], JSON_THROW_ON_ERROR));

        return $root;
    }

    private function classify(string $line, string $root): Classification
    {
        $tree = $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash);

        return $this->app->make(CommandClassifier::class)->classify(
            $tree,
            new ExecutionContext(ShellDialect::Bash, $root, $root),
        );
    }
}
