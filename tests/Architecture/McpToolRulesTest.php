<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Bus\Contracts\Command;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Contracts\StackEditor;
use App\Hooks\Contracts\StackTransactionRunner;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Tools\JournalReadTool;
use App\Mcp\Tools\JournalWriteTool;
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
use ReflectionClass;
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
            if (is_subclass_of($class, JournalWriteTool::class)) {
                $violations = [...$violations, ...$this->commandViolations(new ReflectionClass($class))];
            }
        }

        $this->assertSame([], $violations);
    }

    public function test_the_command_rule_detects_two_commands_and_an_unrelated_call(): void
    {
        $this->assertSame([
            DuplicateCommandTool::class.'::command must construct and return exactly one declared command.',
            DuplicateCommandTool::class.'::command may only prepare command arguments.',
        ], $this->commandViolations(new ReflectionClass(DuplicateCommandTool::class)));
    }

    /**
     * @param  ReflectionClass<covariant JournalWriteTool>  $type
     * @return list<string>
     */
    private function commandViolations(ReflectionClass $type): array
    {
        if ($type->isAbstract()) {
            return [];
        }

        $method = $type->getMethod('command');
        $path = $method->getFileName();
        $this->assertIsString($path);
        $finder = new NodeFinder();
        $node = $finder->findFirst(
            ParsedFile::fromPath($path)->statements,
            fn (Node $node): bool => $node instanceof ClassMethod && $node->getStartLine() === $method->getStartLine(),
        );
        $this->assertInstanceOf(ClassMethod::class, $node);
        $this->assertIsArray($node->stmts);

        $declared = $type->getAttributes(Dispatches::class);
        $this->assertCount(1, $declared, $type->name);
        $command = $declared[0]->newInstance()->command;
        $constructions = $finder->find($node->stmts, fn (Node $node): bool => $node instanceof Expr\New_
            && $node->class instanceof ParsedName && is_a($node->class->toString(), Command::class, true));
        $returned = end($node->stmts);
        $subject = $type->name.'::command';
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
                || ! enum_exists($node->class->toString()),
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
        return in_array($use->name, self::FORBIDDEN_NAMES, true) || is_subclass_of($use->name, Model::class);
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
                if (is_subclass_of($class, Tool::class)) {
                    array_push($found, ...$this->toolViolations(new ReflectionClass($class)));
                }

                if (is_subclass_of($class, Resource::class) && ! is_a($class, JournalResource::class, true)) {
                    $found[] = "{$class} does not extend JournalResource";
                }
            }
        }

        return $found;
    }

    /**
     * @param  ReflectionClass<Tool>  $type
     * @return list<string>
     */
    private function toolViolations(ReflectionClass $type): array
    {
        $class = $type->getName();

        if ($type->isAbstract()) {
            return [];
        }

        $violations = array_any(
            self::TOOL_BASES,
            fn (string $base): bool => class_exists($base) && $type->isSubclassOf($base),
        ) ? [] : ["{$class} extends no journal tool base"];
        $names = $type->getAttributes(Name::class);
        $name = $names === [] ? '' : $names[0]->newInstance()->value;

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
