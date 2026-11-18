<?php

declare(strict_types=1);

namespace App\Processes\Admission;

use App\Processes\Enums\NodeType;
use App\Processes\Enums\OutputRequirement;
use App\Processes\Enums\RedirectType;
use App\Processes\Enums\StreamUse;
use App\Processes\Values\Classification;
use App\Processes\Values\HiddenOutput;
use App\Processes\Values\OutputVerdict;
use App\Processes\Values\PartClassification;
use App\Processes\Values\Redirect;
use App\Processes\Values\ShellNode;
use App\Processes\Values\ShellTree;

/**
 * Refuses a command line that would hide the output of a check or build before anything starts (doc 21 revision 6,
 * section 54): a pipe out of the part or anything around it, a redirect of its output or errors to a file or
 * /dev/null, a closed stream, or a merge of its streams when its contract needs them apart. pipefail and ! waive
 * nothing; an input redirect and an ordinary part are never refused.
 */
final readonly class OutputPolicy
{
    private const array HIDING_REDIRECTS = [RedirectType::Output, RedirectType::Append, RedirectType::Clobber, RedirectType::ReadWrite, RedirectType::Close];

    public function check(Classification $classification): OutputVerdict
    {
        $hidden = [];
        foreach ($classification->parts as $part) {
            if ($part->purpose->outputRequirement() === OutputRequirement::Full) {
                $hidden = [...$hidden, ...$this->hiddenAround($classification->tree, $part)];
            }
        }

        return new OutputVerdict($hidden);
    }

    /**
     * @return list<HiddenOutput>
     */
    private function hiddenAround(ShellTree $tree, PartClassification $part): array
    {
        $own = $tree->node($part->node);
        $correction = $this->withoutRedirects($tree, $own);
        $hidden = [];
        $node = $own;
        while (true) {
            foreach ($node->redirects as $redirect) {
                $lost = $this->lostBy($redirect, $part);
                if ($lost !== []) {
                    $hidden[] = new HiddenOutput($part->node, implode(' and ', $lost), $this->sourceOf($tree, $redirect->range->start, $redirect->range->end), $correction);
                }
            }
            if ($node->isRoot) {
                return $hidden;
            }
            $parent = $tree->node($node->parent);
            if ($parent->type === NodeType::Pipeline && $this->isBeforeTheLastStage($tree, $parent, $node)) {
                $hidden[] = new HiddenOutput($part->node, 'output and exit status', 'the pipe', $correction);
            }
            $node = $parent;
        }
    }

    /**
     * @return list<string>
     */
    private function lostBy(Redirect $redirect, PartClassification $part): array
    {
        if (! in_array($redirect->descriptor, [1, 2], true)) {
            return [];
        }
        $stream = $redirect->descriptor === 1 ? 'standard output' : 'standard error';
        if (in_array($redirect->type, self::HIDING_REDIRECTS, true)) {
            return [$stream];
        }
        $merged = $redirect->type === RedirectType::DuplicateOutput;
        $needsApart = array_any($part->contracts, fn ($contract) => $contract->output->streams === StreamUse::Separate);

        return $merged && $needsApart ? ["{$stream} kept apart"] : [];
    }

    private function isBeforeTheLastStage(ShellTree $tree, ShellNode $pipeline, ShellNode $stage): bool
    {
        $stages = array_values(array_filter($tree->children($pipeline->id), fn (ShellNode $child) => ! in_array($child->type, [NodeType::Comment, NodeType::Redirect], true)));

        return $stages !== [] && $stages[array_key_last($stages)]->id !== $stage->id;
    }

    /**
     * The part's own source with its redirects taken out, as the command to run instead.
     */
    private function withoutRedirects(ShellTree $tree, ShellNode $node): string
    {
        $text = '';
        $at = $node->range->start;
        foreach ($node->redirects as $redirect) {
            $text .= $this->sourceOf($tree, $at, $redirect->range->start);
            $at = $redirect->range->end;
        }

        return trim((string) preg_replace('/\s+/', ' ', $text.$this->sourceOf($tree, $at, $node->range->end)));
    }

    private function sourceOf(ShellTree $tree, int $start, int $end): string
    {
        return substr($tree->source, $start, max(0, $end - $start));
    }
}
