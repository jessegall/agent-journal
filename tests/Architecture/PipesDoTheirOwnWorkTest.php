<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\Bus\Pipe;
use PhpParser\Node;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\PropertyFetch;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\Identifier;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Expression;
use PhpParser\Node\Stmt\Return_;
use PhpParser\NodeFinder;
use Symfony\Component\Finder\Finder;
use Tests\Architecture\Support\ParsedFile;

/**
 * A pipe does its one thing itself: its handle never only hands the value to a service injected into it
 * and returns the answer or the value. Work two pipelines share is a pipe both list.
 */
final class PipesDoTheirOwnWorkTest extends TestCase
{
    private const string HOW_TO_FIX = 'Move the work into the pipe, one thing per pipe, and remove the service it '
        .'forwarded to; work two pipelines share is a pipe both list (rule 98).';

    public function test_no_pipe_only_forwards_its_value_to_a_service(): void
    {
        $forwarding = [];
        $folders = array_filter([base_path('app'), ...glob(base_path('domain/*/src')) ?: []], is_dir(...));

        $pipes = Finder::create()->files()->in($folders)->name('*.php')->contains('/implements[^{]*\bPipe\b/');

        foreach ($pipes as $file) {
            if ($this->forwards(ParsedFile::fromPath($file->getPathname()))) {
                $forwarding[] = $file->getRelativePathname();
            }
        }

        $this->assertSame([], $forwarding, self::HOW_TO_FIX);
    }

    public function test_a_pipe_that_only_forwards_is_caught(): void
    {
        $fixture = ParsedFile::fromPath(base_path('tests/Fixtures/Architecture/Pipes/ForwardingPipe.php'));

        $this->assertTrue($this->forwards($fixture));
    }

    private function forwards(ParsedFile $file): bool
    {
        $finder = new NodeFinder();
        $pipe = $finder->findFirst($file->statements, fn (Node $node) => $node instanceof Class_
            && array_any($node->implements, fn (Node\Name $name) => $name->toString() === Pipe::class));

        // An abstract pipe, such as PipelineAdapter, is the one kind that runs a pipeline for its subclasses.
        if (! $pipe instanceof Class_ || $pipe->isAbstract()) {
            return false;
        }

        $services = $this->injectedNames($pipe);
        $handle = $pipe->getMethod('handle');

        if ($services === [] || $handle === null || $handle->stmts === null || count($handle->stmts) > 2) {
            return false;
        }

        $calls = array_filter($handle->stmts, fn (Node $statement) => $this->callsService($statement, $services));
        $rest = array_filter($handle->stmts, fn (Node $statement) => ! $this->callsService($statement, $services));

        return $calls !== [] && array_all($rest, fn (Node $statement) => $statement instanceof Return_
            && $statement->expr instanceof Variable);
    }

    /**
     * @return list<string>
     */
    private function injectedNames(Class_ $class): array
    {
        $constructor = $class->getMethod('__construct');

        if (! $constructor instanceof ClassMethod) {
            return [];
        }

        $names = [];

        foreach ($constructor->params as $param) {
            if ($param->flags !== 0 && $param->var instanceof Variable && is_string($param->var->name)) {
                $names[] = $param->var->name;
            }
        }

        return $names;
    }

    /**
     * @param  list<string>  $services
     */
    private function callsService(Node $statement, array $services): bool
    {
        $call = match (true) {
            $statement instanceof Return_, $statement instanceof Expression => $statement->expr,
            default => null,
        };

        return $call instanceof MethodCall
            && $call->var instanceof PropertyFetch
            && $call->var->var instanceof Variable
            && $call->var->var->name === 'this'
            && $call->var->name instanceof Identifier
            && in_array($call->var->name->toString(), $services, true);
    }
}
