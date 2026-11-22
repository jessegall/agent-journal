<?php

declare(strict_types=1);

namespace Tests\Unit\Tools;

use PHPUnit\Framework\TestCase;

/**
 * The one class mover, tools/refactoring/move.php over the syntax-tree engine: a rename in place, a whole namespace, a
 * list of moves and a merge each rewrite every reference, and a dry run prints its rows and writes nothing.
 */
final class MoveToolTest extends TestCase
{
    private string $tree;

    protected function setUp(): void
    {
        $this->tree = sys_get_temp_dir().'/move-tool-'.bin2hex(random_bytes(4));
        mkdir($this->tree.'/app/Contracts', 0777, true);
        mkdir($this->tree.'/app/Values');
        file_put_contents($this->tree.'/composer.json', '{"autoload": {"psr-4": {"App\\\\": "app/"}}}');
        file_put_contents($this->tree.'/app/Contracts/Stacks.php', "<?php\n\nnamespace App\\Contracts;\n\ninterface Stacks {}\n");
        file_put_contents($this->tree.'/app/Contracts/Hosts.php', "<?php\n\nnamespace App\\Contracts;\n\ninterface Hosts {}\n");
        file_put_contents($this->tree.'/app/Values/Old.php', "<?php\n\nnamespace App\\Values;\n\nfinal readonly class Old {}\n");
        file_put_contents($this->tree.'/app/Values/Kept.php', "<?php\n\nnamespace App\\Values;\n\nfinal readonly class Kept {}\n");
        file_put_contents($this->tree.'/app/Values/User.php', <<<'PHP'
            <?php

            namespace App\Values;

            use App\Contracts\Hosts;
            use App\Contracts\Stacks;

            final readonly class User
            {
                public function __construct(public Stacks $stacks, public Hosts $hosts, public Old $old) {}
            }

            PHP);
        $this->git('init -q');
        $this->git('add -A');
        $this->git('-c user.name=test -c user.email=test@example.test commit -q -m base');
    }

    protected function tearDown(): void
    {
        exec('rm -rf '.escapeshellarg($this->tree).' '.escapeshellarg($this->tree.'.moves.txt'));
    }

    public function test_a_dry_run_prints_the_rows_and_writes_nothing(): void
    {
        [$exit, $printed] = $this->move('--dry-run', 'App\\Contracts\\Stacks', 'AgentStacks');

        $row = ['App\\Contracts\\Stacks', 'App\\Contracts\\AgentStacks', 'app/Contracts/Stacks.php', 'app/Contracts/AgentStacks.php'];

        $this->assertSame([0, $row], [$exit, explode(' ', trim($printed))]);
        $this->assertFileExists($this->tree.'/app/Contracts/Stacks.php');
    }

    public function test_a_rename_in_place_and_a_namespace_move_rewrite_every_reference(): void
    {
        $this->move('App\\Contracts\\Stacks', 'AgentStacks');
        [$exit] = $this->move('--namespace=App\\Contracts', 'App\\Contracts\\Agents');

        $this->assertSame(0, $exit);
        $this->assertFileExists($this->tree.'/app/Contracts/Agents/AgentStacks.php');
        $this->assertFileExists($this->tree.'/app/Contracts/Agents/Hosts.php');
        $this->assertSame(['App\\Contracts\\Agents\\Hosts', 'App\\Contracts\\Agents\\AgentStacks'], $this->importsOfUser());
        $this->assertSame(['AgentStacks', 'Hosts', 'Old'], $this->parameterTypesOfUser());
    }

    public function test_a_merge_repoints_every_reference_and_deletes_the_old_class(): void
    {
        [$exit] = $this->move('--replace', 'App\\Values\\Old', 'App\\Values\\Kept');

        $this->assertSame(0, $exit);
        $this->assertFileDoesNotExist($this->tree.'/app/Values/Old.php');
        $this->assertSame(['Stacks', 'Hosts', 'Kept'], $this->parameterTypesOfUser());
    }

    public function test_a_list_moves_each_line_and_skips_comments(): void
    {
        file_put_contents($this->tree.'.moves.txt', "# the plainer name\nApp\\Values\\User App\\Values\\Person # plainer\n");

        [$exit] = $this->move('--list='.$this->tree.'.moves.txt');

        $this->assertSame(0, $exit);
        $this->assertFileExists($this->tree.'/app/Values/Person.php');
        $this->assertFileDoesNotExist($this->tree.'/app/Values/User.php');
    }

    public function test_a_move_onto_an_existing_class_needs_the_replace_flag(): void
    {
        [$exit] = $this->move('App\\Values\\Old', 'App\\Values\\Kept');

        $this->assertSame(1, $exit);
        $this->assertFileExists($this->tree.'/app/Values/Old.php');
    }

    /**
     * @return array{int, string}
     */
    private function move(string ...$arguments): array
    {
        $command = [PHP_BINARY, dirname(__DIR__, 3).'/tools/refactoring/move.php', '--root='.$this->tree, ...$arguments];
        $process = proc_open($command, [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
        $printed = (string) stream_get_contents($pipes[1]);
        stream_get_contents($pipes[2]);

        return [proc_close($process), $printed];
    }

    /**
     * @return list<string>
     */
    private function importsOfUser(): array
    {
        preg_match_all('/^use ([^;]+);/m', $this->user(), $imports);

        return $imports[1];
    }

    /**
     * @return list<string>
     */
    private function parameterTypesOfUser(): array
    {
        preg_match_all('/public (\\w+) \\$/', $this->user(), $types);

        return $types[1];
    }

    private function user(): string
    {
        return (string) file_get_contents($this->tree.'/app/Values/User.php');
    }

    private function git(string $arguments): void
    {
        exec('cd '.escapeshellarg($this->tree).' && git '.$arguments);
    }
}
