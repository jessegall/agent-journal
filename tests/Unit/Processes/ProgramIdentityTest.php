<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\Pipelines\Contracts\RunsPipelines;
use App\Pipelines\Support\Pipelines;
use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\UnresolvedType;
use App\Processes\Support\ExecutableCheck;
use App\Processes\Support\ProgramNames;
use App\Processes\Syntax\TreeParser;
use App\Processes\Values\CommandOperation;
use App\Processes\Values\ExecutableBinding;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ProgramIdentity;
use App\Processes\Values\ProgramSpellings;
use App\Processes\Values\UnresolvedFact;
use Illuminate\Container\Container;
use Illuminate\Contracts\Container\Container as ContainerContract;
use PHPUnit\Framework\TestCase;

/**
 * Program names drop their path prefix and map only declared spellings, while the executable they resolve to is
 * checked apart (doc 21 revision 3, section 52; stories 97-104).
 */
final class ProgramIdentityTest extends TestCase
{
    public function test_a_path_and_a_bare_name_share_the_family_and_keep_their_own_token(): void
    {
        $byPath = $this->program('/opt/tools/acme verify');
        $byName = $this->program('acme verify');

        $this->assertSame(['acme', 'acme'], [$byPath->family, $byName->family]);
        $this->assertSame(['/opt/tools/acme', 'acme'], [$byPath->original, $byName->original]);
        $this->assertSame('my tool', $this->program('"/Users/x/a dir/my tool" --flag')->family);
    }

    public function test_operands_and_options_do_not_change_the_identity_or_the_operation(): void
    {
        $status = new CommandOperation($this->program('git status src/a.php'), ['status']);
        $otherStatus = new CommandOperation($this->program('/usr/bin/git status docs/b.md'), ['status']);

        $this->assertTrue($status->isSameOperation($otherStatus));
        $this->assertSame('git status', $status->name());
        $this->assertTrue($this->program('git branch')->isSameProgram($this->program('git branch -D old')));
    }

    public function test_only_a_declared_spelling_maps_to_its_family_and_a_near_miss_is_a_hint(): void
    {
        $php = new ProgramSpellings('php', ['php8.3']);

        $this->assertSame('php', $this->program('php8.3 artisan', [$php])->family);
        $this->assertSame('php8.4', $this->program('php8.4 artisan', [$php])->family);
        $this->assertSame(['php'], new ProgramNames()->proposalHints($this->program('php8.4 artisan', [$php]), [$php]));
        $this->assertSame(
            'something-old',
            $this->program('something-old run', [new ProgramSpellings('something')])->family,
        );
    }

    public function test_a_word_known_only_at_run_time_is_an_unresolved_executable(): void
    {
        $tree = $this->parser()->parse('$TOOL --help', ShellDialect::Bash);
        $part = $tree->executableParts()[0];

        $result = new ProgramNames()->canonical($part->words[0], $part->id, []);

        $this->assertInstanceOf(UnresolvedFact::class, $result);
        $this->assertSame(UnresolvedType::UnresolvedExecutable, $result->type);
    }

    public function test_a_fake_program_earlier_on_the_path_keeps_its_name_but_fails_the_check(): void
    {
        $git = $this->program('git status');
        $binding = ExecutableBinding::builtin('git', ['/usr/bin']);
        $trusted = new ExecutionContext(ShellDialect::Bash, '/work', '/work', programs: ['git' => '/usr/bin/git']);
        $faked = $trusted->withPrograms(['git' => '/tmp/evil/git']);

        $this->assertTrue(new ExecutableCheck()->verify($git, $binding, $trusted)->isTrusted);
        $verdict = new ExecutableCheck()->verify($git, $binding, $faked);
        $this->assertFalse($verdict->isTrusted);
        $this->assertSame(['git', '/tmp/evil/git'], [$verdict->program->family, $verdict->resolvedPath]);
    }

    public function test_a_project_tool_is_trusted_by_its_path_and_content(): void
    {
        $root = sys_get_temp_dir().'/program-identity-'.getmypid();
        @mkdir("{$root}/bin", 0777, true);
        file_put_contents("{$root}/bin/check", "#!/bin/sh\necho ok\n");
        $binding = ExecutableBinding::projectContent(
            'check',
            'bin/check',
            (string) hash_file('sha256', "{$root}/bin/check"),
            1,
        );
        $context = new ExecutionContext(ShellDialect::Bash, $root, $root);

        try {
            $this->assertTrue(
                new ExecutableCheck()->verify($this->program('./bin/check'), $binding, $context)->isTrusted,
            );
            file_put_contents("{$root}/bin/check", "#!/bin/sh\nrm -rf /\n");
            $this->assertFalse(
                new ExecutableCheck()->verify($this->program('./bin/check'), $binding, $context)->isTrusted,
            );
        } finally {
            @unlink("{$root}/bin/check");
            @rmdir("{$root}/bin");
            @rmdir($root);
        }
    }

    /**
     * @param  list<ProgramSpellings>  $spellings
     */
    private function program(string $line, array $spellings = []): ProgramIdentity
    {
        $part = $this->parser()->parse($line, ShellDialect::Bash)->executableParts()[0];
        $program = new ProgramNames()->canonical($part->words[0], $part->id, $spellings);
        $this->assertInstanceOf(ProgramIdentity::class, $program);

        return $program;
    }

    private function parser(): TreeParser
    {
        $container = new Container();
        $container->bind(RunsPipelines::class, Pipelines::class);
        $container->instance(ContainerContract::class, $container);

        return $container->make(TreeParser::class);
    }
}
