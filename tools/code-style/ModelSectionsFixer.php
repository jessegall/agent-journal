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
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\ParserFactory;
use RuntimeException;
use SplFileInfo;

require_once dirname(__DIR__).'/refactoring/model-sections.php';

/**
 * An Eloquent model's methods sit in their marked sections, in the order of rule 50, as model-sections.php sorts
 * them: a method stays in the section it sits in, an accessor goes to Accessors, and a method without a section goes
 * where its looks put it. A model with a member below its first method is left for its author.
 */
final class ModelSectionsFixer implements FixerInterface
{
    public function getName(): string
    {
        return 'Journal/model_sections';
    }

    public function getDefinition(): FixerDefinitionInterface
    {
        return new FixerDefinition(
            "A model's methods are sorted into the marked sections of rule 50.",
            [new CodeSample("<?php\nclass Task extends Model\n{\n"
                ."    public function isOpen(): bool\n    {\n        return true;\n"
                ."    }\n}\n")],
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
        $sorted = $source;

        foreach (array_keys($this->modelsOf($source)) as $number) {
            $model = $this->modelsOf($sorted)[$number] ?? null;

            if ($model === null) {
                break;
            }

            try {
                $sorted = \sorted($sorted, $model);
            } catch (RuntimeException) {
                // A member below the first method stays where its author put it; the model is left as it is.
                continue;
            }
        }

        if ($sorted !== $source) {
            $tokens->setCode($sorted);
        }
    }

    /**
     * @return list<Class_>
     */
    private function modelsOf(string $source): array
    {
        try {
            $ast = new ParserFactory()->createForNewestSupportedVersion()->parse($source) ?? [];
        } catch (Error) {
            return [];
        }

        // A class's full name, which tells a model, is set only once its names are resolved.
        $traverser = new NodeTraverser();
        $traverser->addVisitor(new NameResolver());
        $resolved = $traverser->traverse($ast);

        return array_values(array_filter(new NodeFinder()->findInstanceOf($resolved, Class_::class), \isModel(...)));
    }
}
