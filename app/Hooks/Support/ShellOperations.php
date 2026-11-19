<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Agents\Values\Operation;
use App\Agents\Values\ResourceRequest;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Processes\Enums\RedirectType;
use App\Processes\Values\ClassFact;
use App\Processes\Values\Classification;
use App\Processes\Values\PartClassification;
use App\Processes\Values\Redirect;
use App\Processes\Values\RuleOrigin;
use App\Processes\Values\ShellNode;
use App\Processes\Values\SyntaxOrigin;
use App\Processes\Values\Word;

/**
 * Turns the parser's classification of one shell line into the operations an access policy decides: one per
 * executable part, named by the rule that classified it, needing Execute and its classes' access on its literal
 * operands, and one per file redirect on its target. A part the classifier could not place needs no grantable access,
 * so no grant matches it.
 */
final readonly class ShellOperations
{
    public const string SURFACE = 'shell';

    public const string UNKNOWN = 'shell:unknown';

    public const int DECLARATION_REVISION = 1;

    /**
     * @return list<Operation>
     */
    public function of(Classification $classification): array
    {
        $operations = [];

        foreach ($classification->parts as $part) {
            $node = $classification->tree->node($part->node);
            $operations[] = $this->operationOf($part, $node);
            array_push($operations, ...$this->redirectOperations($node));
        }

        return $operations;
    }

    private function operationOf(PartClassification $part, ShellNode $node): Operation
    {
        $words = array_map(fn (Word $word): string => $word->literal() ?? '', $node->words);

        $facts = array_values(
            array_filter($part->facts, fn (ClassFact $fact): bool => ! $fact->origin instanceof SyntaxOrigin),
        );
        $name = self::nameOf($part, $facts);

        if (! $part->isKnown() || $name === self::UNKNOWN) {
            return new Operation(self::SURFACE, self::UNKNOWN, [], [], $words, self::DECLARATION_REVISION);
        }

        $access = [AccessType::Execute];

        foreach ($facts as $fact) {
            array_push($access, ...$fact->class->accessTypes());
        }

        return new Operation(
            self::SURFACE,
            $name,
            array_values(array_unique($access, SORT_REGULAR)),
            self::operandsOf($node),
            $words,
            self::DECLARATION_REVISION,
        );
    }

    /**
     * @return list<Operation>
     */
    private function redirectOperations(ShellNode $node): array
    {
        $operations = [];

        foreach ($node->redirects as $redirect) {
            $access = self::redirectAccess($redirect);
            $target = $redirect->target instanceof Word ? $redirect->target->literal() : null;

            if ($access !== [] && $target !== null) {
                $operations[] = new Operation(
                    self::SURFACE,
                    "shell:redirect.{$redirect->type->value}",
                    $access,
                    [new ResourceRequest(ResourceAreaType::Workspace, $target)],
                    [$target],
                    self::DECLARATION_REVISION,
                );
            }
        }

        return $operations;
    }

    /**
     * @return list<AccessType>
     */
    private static function redirectAccess(Redirect $redirect): array
    {
        return match ($redirect->type) {
            RedirectType::Input => [AccessType::Read],
            RedirectType::Output, RedirectType::Append, RedirectType::Clobber => [AccessType::Create, AccessType::Edit],
            RedirectType::ReadWrite => [AccessType::Read, AccessType::Create, AccessType::Edit],
            RedirectType::DuplicateInput, RedirectType::DuplicateOutput, RedirectType::Close,
            RedirectType::HereDocument, RedirectType::HereString => [],
        };
    }

    /**
     * The part's stable name: the rule that classified it, else its program; a part with neither is unknown.
     *
     * @param  list<ClassFact>  $facts
     */
    private static function nameOf(PartClassification $part, array $facts): string
    {
        foreach ($facts as $fact) {
            if ($fact->origin instanceof RuleOrigin) {
                return 'shell:'.$fact->origin->rule;
            }
        }

        return $part->program === null ? self::UNKNOWN : 'shell:'.$part->program->family;
    }

    /**
     * The literal operands after the program, which are not options, as workspace resources.
     *
     * @return list<ResourceRequest>
     */
    private static function operandsOf(ShellNode $node): array
    {
        $operands = [];

        foreach (array_slice($node->words, 1) as $word) {
            $text = $word->literal();

            if ($text !== null && $text !== '' && ! str_starts_with($text, '-')) {
                $operands[] = new ResourceRequest(ResourceAreaType::Workspace, $text);
            }
        }

        return $operands;
    }
}
