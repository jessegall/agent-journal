<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\Bus\Command;
use App\Contracts\Work\AgentStack;
use App\Contracts\Work\StackEditor;
use App\Contracts\Work\StackTransactionRunner;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Tools\JournalReadTool;
use App\Mcp\Tools\JournalWriteTool;
use App\Support\Reflector;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Eloquent\Model;
use Illuminate\JsonSchema\JsonSchemaTypeFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Resource;
use Laravel\Mcp\Server\Tool;
use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\Name as ParsedName;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Return_;
use PhpParser\NodeFinder;
use Tests\Architecture\Support\ClassesDeclared;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\NamesUsed;
use Tests\Architecture\Support\NameUse;
use Tests\Architecture\Support\ParsedFile;
use Tests\Fixtures\Mcp\DuplicateCommandTool;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A journal MCP tool or resource holds no logic of its own (doc 16, section 3.4): it names no model, query builder,
 * database, transaction, event dispatcher or stack contract; a tool extends the journal's base and is named in
 * snake_case; and no schema asks for the caller's identity.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class McpToolRulesTest extends TestCase
{
    /**
     * Names an Mcp class may not use; any Eloquent model is refused besides these.
     */
    private const array FORBIDDEN_NAMES = [
        'Illuminate\Database\Eloquent\Builder',
        'Illuminate\Database\Query\Builder',
        DB::class,
        DatabaseManager::class,
        ConnectionInterface::class,
        Dispatcher::class,
        Event::class,
        AgentStack::class,
        StackEditor::class,
        StackTransactionRunner::class,
    ];

    /**
     * The bases a tool may extend.
     */
    private const array TOOL_BASES = [JournalReadTool::class, JournalWriteTool::class];

    private const array IDENTITY_PROPERTIES = ['caller_agent_id', 'agent_id', 'session_id', 'actor'];

    private const string SNAKE_CASE = '/^[a-z][a-z0-9]*(_[a-z0-9]+)*$/';

    public function test_mcp_classes_name_no_model_query_transaction_event_or_stack(): void
    {
        $this->assertSame([], $this->forbiddenUsesIn($this->mcpFiles()));
    }

    public function test_every_tool_extends_a_journal_base_has_a_snake_case_name_and_asks_no_caller_identity(): void
    {
        $this->assertSame([], $this->classViolationsIn($this->mcpFiles()));
    }

    public function test_a_tool_that_queries_a_model_is_named_with_its_class_and_line(): void
    {
        $this->assertSame(
            [
                'tests/Fixtures/Mcp/Leaky/LeakyReadTool.php:8 uses App\Mcp\Models\RetainedPage',
                'tests/Fixtures/Mcp/Leaky/LeakyReadTool.php:21 uses App\Mcp\Models\RetainedPage',
            ],
            $this->forbiddenUsesIn(DomainFiles::in([base_path('tests/Fixtures/Mcp/Leaky')])),
        );
    }

    public function test_write_tools_only_construct_their_declared_command(): void
    {
        $violations = [];

        foreach (ScanCache::findings(new ClassesDeclared(), $this->mcpFiles()) as $class) {
            $tool = Reflector::find($class)
                ->filter(fn (Reflector $type) => $type->isSubclassOf(JournalWriteTool::class));

            if ($tool->isDefined()) {
                $violations = [...$violations, ...$this->commandViolations($tool->get())];
            }
        }

        $this->assertSame([], $violations);
    }

    public function test_the_command_rule_detects_two_commands_and_an_unrelated_call(): void
    {
        $this->assertSame([
            DuplicateCommandTool::class.'::command must construct and return exactly one declared command.',
            DuplicateCommandTool::class.'::command may only prepare command arguments.',
        ], $this->commandViolations(Reflector::of(DuplicateCommandTool::class)));
    }

    /**
     * @param  Reflector<object>  $type
     * @return list<string>
     */
    private function commandViolations(Reflector $type): array
    {
        if ($type->isAbstract()) {
            return [];
        }

        $method = $type->method('command');
        $this->assertTrue($method->fileName()->isDefined());
        $path = $method->fileName()->get();
        $finder = new NodeFinder();
        $node = $finder->findFirst(
            ParsedFile::fromPath($path)->statements,
            fn (Node $node): bool => $node instanceof ClassMethod && $node->getStartLine() === $method->startLine(),
        );
        $this->assertInstanceOf(ClassMethod::class, $node);
        $this->assertIsArray($node->stmts);

        $declared = $type->attributes(Dispatches::class);
        $this->assertCount(1, $declared, $type->name());
        $command = $declared->first()->get()->command;
        $constructions = $finder->find($node->stmts, fn (Node $node): bool => $node instanceof Expr\New_
            && $node->class instanceof ParsedName
            && Reflector::find($node->class->toString())->filter(fn (Reflector $made) => $made->is(Command::class))
                ->isDefined());
        $returned = end($node->stmts);
        $subject = $type->name().'::command';
        $violations = [];

        if (count($constructions) !== 1 || ! $returned instanceof Return_ || ! $returned->expr instanceof Expr\New_
            || ! $returned->expr->class instanceof ParsedName || $returned->expr->class->toString() !== $command) {
            $violations[] = "{$subject} must construct and return exactly one declared command.";
        }

        if ($finder->findFirst($node->stmts, $this->isUnrelatedCommandWork(...)) instanceof Node) {
            $violations[] = "{$subject} may only prepare command arguments.";
        }

        return $violations;
    }

    private function isUnrelatedCommandWork(Node $node): bool
    {
        return match (true) {
            $node instanceof Expr\FuncCall,
            $node instanceof Expr\Include_,
            $node instanceof Expr\Eval_,
            $node instanceof Expr\NullsafeMethodCall,
            $node instanceof Expr\StaticPropertyFetch => true,
            $node instanceof Expr\Assign => ! $node->var instanceof Expr\Variable || $node->var->name === 'this',
            $node instanceof Expr\PropertyFetch => true,
            $node instanceof Expr\StaticCall => ! $node->class instanceof ParsedName
                || ! Reflector::find($node->class->toString())->filter(fn (Reflector $type) => $type->isEnum())
                    ->isDefined(),
            $node instanceof Expr\MethodCall => ! $node->var instanceof Expr\Variable
                || ! in_array($node->var->name, ['arguments', 'this'], true),
            default => false,
        };
    }

    /**
     * Every PHP file under an Mcp folder of a Core area or a domain, and Core's own tools and resources.
     *
     * @return list<string>
     */
    private function mcpFiles(): array
    {
        $folders = [
            ...(glob(app_path('*/Mcp'), GLOB_ONLYDIR) ?: []),
            ...(glob(base_path('domain/*/src/Mcp'), GLOB_ONLYDIR) ?: []),
            app_path('Mcp/Tools'),
            app_path('Mcp/Resources'),
        ];

        return DomainFiles::in($folders);
    }

    /**
     * @param  list<string>  $files
     * @return list<string>
     */
    private function forbiddenUsesIn(array $files): array
    {
        $found = [];

        foreach (ScanCache::findingsByFile(new NamesUsed(), $files) as $path => $uses) {
            foreach ($uses as $use) {
                if ($this->isForbidden($use)) {
                    $found[] = substr($path, strlen(base_path()) + 1).":{$use->line} uses {$use->name}";
                }
            }
        }

        return array_values(array_unique($found));
    }

    private function isForbidden(NameUse $use): bool
    {
        return in_array($use->name, self::FORBIDDEN_NAMES, true)
            || Reflector::factory()->isSubclassOf($use->name, Model::class);
    }

    /**
     * @param  list<string>  $files
     * @return list<string>
     */
    private function classViolationsIn(array $files): array
    {
        $found = [];

        foreach (ScanCache::findingsByFile(new ClassesDeclared(), $files) as $classes) {
            foreach ($classes as $class) {
                $type = Reflector::find($class);

                if ($type->isEmpty()) {
                    continue;
                }

                $declaration = $type->get();

                if ($declaration->isSubclassOf(Tool::class)) {
                    array_push($found, ...$this->toolViolations($declaration));
                }

                if (Reflector::factory()->isSubclassOf($class, Resource::class)
                    && ! Reflector::factory()->is($class, JournalResource::class)) {
                    $found[] = "{$class} does not extend JournalResource";
                }
            }
        }

        return $found;
    }

    /**
     * @param  Reflector<Tool>  $type
     * @return list<string>
     */
    private function toolViolations(Reflector $type): array
    {
        $class = $type->name();

        if ($type->isAbstract()) {
            return [];
        }

        $violations = array_any(
            self::TOOL_BASES,
            fn (string $base): bool => $type->isSubclassOf($base),
        ) ? [] : ["{$class} extends no journal tool base"];
        $name = $type->attributes(Name::class)->first()->map(fn (Name $declared) => $declared->value)->getOrElse('');

        if (preg_match(self::SNAKE_CASE, $name) !== 1) {
            $violations[] = "{$class} has no snake_case #[Name]";
        }

        foreach (array_intersect(
            array_keys($type->newInstanceWithoutConstructor()->schema(new JsonSchemaTypeFactory())),
            self::IDENTITY_PROPERTIES,
        ) as $property) {
            $violations[] = "{$class} asks for {$property}";
        }

        return $violations;
    }
}
