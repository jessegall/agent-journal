<?php

declare(strict_types=1);

namespace Tests\Unit\Tools;

use PhpParser\Node\Expr\ClassConstFetch;
use PhpParser\Node\Name;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassConst;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\UseItem;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;
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

    public function test_a_docblock_that_names_a_moved_neighbour_bare_gets_its_import(): void
    {
        file_put_contents($this->tree.'/app/Contracts/Hosts.php', <<<'PHP'
            <?php

            namespace App\Contracts;

            interface Hosts
            {
                /**
                 * @return list<Stacks>
                 */
                public function stacks(): array;
            }

            PHP);
        $this->git('add -A');
        $this->git('-c user.name=test -c user.email=test@example.test commit -q -m docblock');

        [$exit] = $this->move('App\\Contracts\\Stacks', 'App\\Contracts\\Agents\\Stacks');

        preg_match_all('/^use ([^;]+);/m', (string) file_get_contents($this->tree.'/app/Contracts/Hosts.php'), $imports);
        $this->assertSame([0, ['App\\Contracts\\Agents\\Stacks']], [$exit, $imports[1]]);
    }

    public function test_a_bare_name_in_a_docblock_follows_a_rename(): void
    {
        file_put_contents($this->tree.'/app/Contracts/Hosts.php', <<<'PHP'
            <?php

            namespace App\Contracts;

            interface Hosts
            {
                /**
                 * @return list<Stacks>
                 */
                public function stacks(): array;
            }

            PHP);
        $this->git('add -A');
        $this->git('-c user.name=test -c user.email=test@example.test commit -q -m docblock');

        [$exit] = $this->move('App\\Contracts\\Stacks', 'AgentStacks');

        preg_match('/@return list<(\\w+)>/', (string) file_get_contents($this->tree.'/app/Contracts/Hosts.php'), $type);
        $this->assertSame([0, 'AgentStacks'], [$exit, $type[1]]);
    }

    public function test_a_merge_repoints_every_reference_and_deletes_the_old_class(): void
    {
        [$exit] = $this->move('--replace', 'App\\Values\\Old', 'App\\Values\\Kept');

        $this->assertSame(0, $exit);
        $this->assertFileDoesNotExist($this->tree.'/app/Values/Old.php');
        $this->assertSame(['Stacks', 'Hosts', 'Kept'], $this->parameterTypesOfUser());
    }

    public function test_a_merge_carries_the_old_members_interfaces_and_imports_into_the_kept_class(): void
    {
        file_put_contents($this->tree.'/app/Values/Old.php', <<<'PHP'
            <?php

            namespace App\Values;

            use App\Contracts\Hosts;

            final readonly class Old implements Hosts
            {
                public const string LABEL = 'old';

                // The hosts it was handed.
                public function hosts(Hosts $hosts): Hosts
                {
                    return $hosts;
                }
            }

            PHP);
        file_put_contents($this->tree.'/app/Values/Kept.php', <<<'PHP'
            <?php

            namespace App\Values;

            final readonly class Kept
            {
                public function kept(): string
                {
                    return Old::LABEL;
                }
            }

            PHP);

        [$exit] = $this->move('--replace', 'App\\Values\\Old', 'App\\Values\\Kept');

        $this->assertSame(0, $exit);
        $this->assertFileDoesNotExist($this->tree.'/app/Values/Old.php');
        $this->assertSame(
            [
                'imports' => ['App\\Contracts\\Hosts'],
                'implements' => ['App\\Contracts\\Hosts'],
                'members' => ['LABEL', 'kept', 'hosts'],
                'comments' => ['hosts' => ['// The hosts it was handed.']],
                'classes read' => ['Kept'],
            ],
            $this->shapeOfKept(),
        );
    }

    public function test_a_file_that_imports_both_classes_keeps_one_import_of_the_kept_class(): void
    {
        file_put_contents($this->tree.'/app/Contracts/Both.php', <<<'PHP'
            <?php

            namespace App\Contracts;

            use App\Values\Kept;
            use App\Values\Old;

            final readonly class Both
            {
                public function __construct(public Kept $kept, public Old $old) {}
            }

            PHP);

        [$exit] = $this->move('--replace', 'App\\Values\\Old', 'App\\Values\\Kept');
        preg_match_all('/^use ([^;]+);/m', (string) file_get_contents($this->tree.'/app/Contracts/Both.php'), $imports);

        $this->assertSame([0, ['App\\Values\\Kept']], [$exit, $imports[1]]);
    }

    public function test_a_merge_of_a_member_name_in_both_classes_is_refused_and_writes_nothing(): void
    {
        $method = "\n    public function label(): string\n    {\n        return '%s';\n    }\n";
        file_put_contents($this->tree.'/app/Values/Old.php', "<?php\n\nnamespace App\\Values;\n\nfinal readonly class Old\n{".sprintf($method, 'old')."}\n");
        file_put_contents($this->tree.'/app/Values/Kept.php', "<?php\n\nnamespace App\\Values;\n\nfinal readonly class Kept\n{".sprintf($method, 'kept')."}\n");

        [$exit] = $this->move('--replace', 'App\\Values\\Old', 'App\\Values\\Kept');

        $this->assertSame(1, $exit);
        $this->assertFileExists($this->tree.'/app/Values/Old.php');
        $this->assertStringNotContainsString("'old'", (string) file_get_contents($this->tree.'/app/Values/Kept.php'));
    }

    public function test_a_list_moves_each_line_and_skips_comments(): void
    {
        file_put_contents($this->tree.'.moves.txt', "# the plainer name\nApp\\Values\\User App\\Values\\Member # plainer\n");

        [$exit] = $this->move('--list='.$this->tree.'.moves.txt');

        $this->assertSame(0, $exit);
        $this->assertFileExists($this->tree.'/app/Values/Member.php');
        $this->assertFileDoesNotExist($this->tree.'/app/Values/User.php');
    }

    public function test_a_move_onto_an_existing_class_needs_the_replace_flag(): void
    {
        [$exit] = $this->move('App\\Values\\Old', 'App\\Values\\Kept');

        $this->assertSame(1, $exit);
        $this->assertFileExists($this->tree.'/app/Values/Old.php');
    }

    /**
     * What the merged Kept class holds, read from its syntax tree: its imports, the interfaces it implements, its
     * members in order, the comments above each method, and the classes it reads a constant of.
     *
     * @return array{imports: list<string>, implements: list<string>, members: list<string>, comments: array<string, list<string>>, classes read: list<string>}
     */
    private function shapeOfKept(): array
    {
        $tree = new ParserFactory()->createForHostVersion()->parse(
            (string) file_get_contents($this->tree.'/app/Values/Kept.php'),
        ) ?? [];
        $finder = new NodeFinder();
        $class = $finder->findFirstInstanceOf($tree, Class_::class);
        $members = [];
        $comments = [];

        foreach ($class?->stmts ?? [] as $member) {
            $names = match (true) {
                $member instanceof ClassMethod => [$member->name->toString()],
                $member instanceof ClassConst => array_map(fn ($constant) => $constant->name->toString(), $member->consts),
                default => [],
            };
            $members = [...$members, ...$names];

            if ($member instanceof ClassMethod && $member->getComments() !== []) {
                $comments[$member->name->toString()] = array_map(fn ($comment) => $comment->getText(), $member->getComments());
            }
        }

        return [
            'imports' => array_map(fn (UseItem $use) => $use->name->toString(), $finder->findInstanceOf($tree, UseItem::class)),
            'implements' => array_map(fn (Name $name) => $name->toString(), $class?->implements ?? []),
            'members' => $members,
            'comments' => $comments,
            'classes read' => array_map(
                fn (ClassConstFetch $fetch) => $fetch->class instanceof Name ? $fetch->class->toString() : '',
                $finder->findInstanceOf($tree, ClassConstFetch::class),
            ),
        ];
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
