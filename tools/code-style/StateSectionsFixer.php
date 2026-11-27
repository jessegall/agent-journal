<?php

declare(strict_types=1);

namespace Tools\CodeStyle;

use PhpCsFixer\Fixer\FixerInterface;
use PhpCsFixer\FixerDefinition\CodeSample;
use PhpCsFixer\FixerDefinition\FixerDefinition;
use PhpCsFixer\FixerDefinition\FixerDefinitionInterface;
use PhpCsFixer\Tokenizer\Tokens;
use PhpParser\Error;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Interface_;
use PhpParser\NodeFinder;
use PhpParser\Parser;
use PhpParser\ParserFactory;
use SplFileInfo;

/**
 * An agent state lays out its methods as the state machine reads them (rule 94): the constructor, reference makers
 * and own answers under no marker, then Lifecycle (onEnter, onExit, onResume), Hooks (in the order the HookHandler
 * contract declares them, then the tick), Events (the on methods that hear a fact) and Internals, each section
 * opened by its marker. A state with a member below its first method is left for its author.
 */
final class StateSectionsFixer implements FixerInterface
{
    private const array LIFECYCLE = [
        'onEnter',
        'onExit',
        'onResume',
    ];

    private const string TICK = 'onTick';

    private const string MARKER = '/^\s*\/\/ -+\[ (\w+) \]-+\s*$/';

    /**
     * The contract whose hook methods a state's Hooks section follows, in the order it declares them.
     */
    private const string HOOK_CONTRACT = 'app/Stacks/Inputs/Contracts/HookHandler.php';

    private Parser $parser;

    public function __construct()
    {
        $this->parser = new ParserFactory()->createForNewestSupportedVersion();
    }

    public function getName(): string
    {
        return 'Journal/state_sections';
    }

    public function getDefinition(): FixerDefinitionInterface
    {
        return new FixerDefinition(
            "An agent state's methods sit in the sections Lifecycle, Hooks, Events and Internals of rule 94.",
            [new CodeSample("<?php\nfinal class Waiting extends AgentState\n{\n"
                ."    private function wait(): void\n    {\n    }\n\n"
                ."    public function onEnter(): void\n    {\n    }\n}\n")],
        );
    }

    public function isCandidate(Tokens $tokens): bool
    {
        return $tokens->isAllTokenKindsFound([T_CLASS, T_EXTENDS, T_FUNCTION]);
    }

    public function isRisky(): bool
    {
        return false;
    }

    public function getPriority(): int
    {
        return 30;
    }

    public function supports(SplFileInfo $file): bool
    {
        return new ProjectFolders(['app', 'domain'])->holds($file);
    }

    public function fix(SplFileInfo $file, Tokens $tokens): void
    {
        $source = $tokens->generateCode();
        $state = array_values(array_filter(
            $this->classesOf($source),
            fn (Class_ $class) => $class->extends?->getLast() === 'AgentState',
        ))[0] ?? null;

        if ($state === null || $this->hasMemberBelowFirstMethod($state)) {
            return;
        }

        $sorted = $this->sorted($source, $state);

        if ($sorted !== $source) {
            $tokens->setCode($sorted);
        }
    }

    /**
     * The source with the state's methods placed in their sections, each section opened by its marker.
     */
    private function sorted(string $source, Class_ $state): string
    {
        $methods = $state->getMethods();
        $hooks = $this->hookMethods();
        $sections = [
            '' => [],
            'Lifecycle' => [],
            'Hooks' => [],
            'Events' => [],
            'Internals' => [],
        ];

        foreach ($methods as $method) {
            $sections[$this->sectionOf($method, $hooks)][$method->name->toString()] = $this->textOf($source, $method);
        }

        $sections['Lifecycle'] = $this->inOrder($sections['Lifecycle'], self::LIFECYCLE);
        $sections['Hooks'] = $this->inOrder($sections['Hooks'], [...$hooks, self::TICK]);
        $parts = array_values($sections['']);

        foreach (array_filter($sections) as $name => $texts) {
            if ($name !== '') {
                $parts[] = "    // ----------[ {$name} ]----------\n\n".implode("\n\n", $texts);
            }
        }

        $first = $this->startOf($methods[0]);
        $start = strrpos(substr($source, 0, $first), "\n") + 1;
        $end = end($methods)->getEndFilePos() + 1;

        return substr($source, 0, $start).implode("\n\n", $parts).substr($source, $end);
    }

    /**
     * The section a state's method belongs in; the empty name for what stands above the first marker.
     *
     * @param  list<string>  $hooks
     */
    private function sectionOf(ClassMethod $method, array $hooks): string
    {
        $name = $method->name->toString();

        return match (true) {
            ! $method->isPublic() => 'Internals',
            $method->isStatic(), $name === '__construct' => '',
            in_array($name, self::LIFECYCLE, true) => 'Lifecycle',
            in_array($name, $hooks, true), $name === self::TICK => 'Hooks',
            str_starts_with($name, 'on') && $method->getParams() !== [] => 'Events',
            default => '',
        };
    }

    /**
     * The texts by method name, those the order names first in its order, the others after them as they stood.
     *
     * @param  array<string, string>  $texts
     * @param  list<string>  $order
     * @return array<string, string>
     */
    private function inOrder(array $texts, array $order): array
    {
        $named = array_intersect_key(array_flip($order), $texts);
        asort($named);

        return [
            ...array_intersect_key($texts, $named),
            ...array_diff_key($texts, $named),
        ];
    }

    /**
     * The hook methods in the order the contract declares them.
     *
     * @return list<string>
     */
    private function hookMethods(): array
    {
        $contract = array_values(array_filter(
            new NodeFinder()->findInstanceOf(
                $this->parser->parse((string) file_get_contents(dirname(__DIR__, 2).'/'.self::HOOK_CONTRACT)) ?? [],
                Interface_::class,
            ),
        ))[0];

        return array_map(fn (ClassMethod $method) => $method->name->toString(), $contract->getMethods());
    }

    private function hasMemberBelowFirstMethod(Class_ $state): bool
    {
        $methods = $state->getMethods();

        return $methods === [] || array_any(
            $state->stmts,
            fn ($member) => ! $member instanceof ClassMethod && $member->getStartLine() > $methods[0]->getStartLine(),
        );
    }

    /**
     * @return list<Class_>
     */
    private function classesOf(string $source): array
    {
        try {
            return new NodeFinder()->findInstanceOf($this->parser->parse($source) ?? [], Class_::class);
        } catch (Error) {
            return [];
        }
    }

    /**
     * The offset where a method's text starts: its first comment, or the method itself.
     */
    private function startOf(ClassMethod $method): int
    {
        $comments = $method->getComments();

        if ($comments === []) {
            return $method->getStartFilePos();
        }

        return $comments[0]->getStartFilePos();
    }

    /**
     * A method's text without the section markers above it, and with its leading indentation.
     */
    private function textOf(string $source, ClassMethod $method): string
    {
        $start = $this->startOf($method);
        $lineStart = strrpos(substr($source, 0, $start), "\n") + 1;
        $text = substr($source, $lineStart, $method->getEndFilePos() + 1 - $lineStart);
        $lines = array_filter(explode("\n", $text), fn (string $line) => preg_match(self::MARKER, $line) !== 1);

        return trim(implode("\n", $lines), "\n");
    }
}
