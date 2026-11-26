<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PhpParser\Node;
use PhpParser\NodeFinder;
use Symfony\Component\Finder\Finder;
use Tests\Architecture\Support\ParsedFile;

/**
 * A value whose type is a *Status enum is named status, never state, as a property, a parameter or a property of a
 * constructor.
 */
final class StatusesAreNamedStatusTest extends TestCase
{
    private const string HOW_TO_FIX = 'Name the value status, with every reader (user message 26393, task 3546).';

    public function test_no_status_is_named_state(): void
    {
        $named = [];
        $folders = array_filter(
            [
                base_path('app'),
                base_path('tests'),
                ...glob(base_path('domain/*/src')) ?: [],
                ...glob(base_path('domain/*/tests')) ?: [],
            ],
            is_dir(...),
        );
        $files = Finder::create()->files()->in($folders)->name('*.php')->notPath('Fixtures/Architecture/Statuses')
            ->contains('/Status(\|null)? \$state\b/');

        foreach ($files as $file) {
            if ($this->namesStatusState(ParsedFile::fromPath($file->getPathname()))) {
                $named[] = $file->getRelativePathname();
            }
        }

        $this->assertSame([], $named, self::HOW_TO_FIX);
    }

    public function test_a_status_named_state_is_caught(): void
    {
        $fixture = ParsedFile::fromPath(base_path('tests/Fixtures/Architecture/Statuses/StatusNamedState.php'));

        $this->assertTrue($this->namesStatusState($fixture));
    }

    private function namesStatusState(ParsedFile $file): bool
    {
        $finder = new NodeFinder();
        $properties = $finder->find($file->statements, fn (Node $node) => $node instanceof Node\Stmt\Property
            && $this->isStatus($node->type)
            && array_any($node->props, fn (Node\PropertyItem $item) => $item->name->toString() === 'state'));
        $parameters = $finder->find($file->statements, fn (Node $node) => $node instanceof Node\Param
            && $node->var instanceof Node\Expr\Variable
            && $node->var->name === 'state'
            && $this->isStatus($node->type));

        return $properties !== [] || $parameters !== [];
    }

    private function isStatus(Node|null $type): bool
    {
        return match (true) {
            $type instanceof Node\NullableType => $this->isStatus($type->type),
            $type instanceof Node\UnionType => array_any($type->types, $this->isStatus(...)),
            $type instanceof Node\Name => str_ends_with($type->getLast(), 'Status'),
            default => false,
        };
    }
}
