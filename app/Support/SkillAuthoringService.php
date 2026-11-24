<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Skills\SkillResolver;
use App\Data\Skills\SkillRevisionRow;
use App\Data\Skills\SkillRevisionView;
use App\Data\Skills\SkillWriteReceipt;
use App\Enums\SkillOrigin;
use App\Exceptions\ConsoleOwnerMissing;
use App\Exceptions\ShippedSkillReadOnly;
use App\Exceptions\SkillConditionInvalid;
use App\Exceptions\SkillMissing;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillRevision;
use App\Values\SectionDraft;
use App\Values\SkillDraft;
use App\Values\SkillKey;
use App\Values\SkillRevisionResult;
use App\Values\SkillSection;
use Illuminate\Support\Str;

/**
 * What every skill authoring entry point shares, on the command line and over MCP: acting as the journal owner on
 * the command line, finding a stored skill by number or key,
 * turning a Markdown body and audience flags into a draft, and the plain lines a save prints.
 */
final readonly class SkillAuthoringService
{
    public function __construct(
        private ConsoleOwner $console,
        private SkillResolver $skills,
    ) {}

    /**
     * @throws ConsoleOwnerMissing
     */
    public function actAsOwner(): void
    {
        $this->console->actAsOwner();
    }

    /**
     * The stored skill a number or key names; a shipped key is refused with the offer to copy it.
     *
     * @throws ShippedSkillReadOnly
     * @throws SkillMissing
     */
    public function storedSkill(string $numberOrKey): Skill
    {
        if (ctype_digit($numberOrKey)) {
            $id = Skill::idOfNumber((int) $numberOrKey);

            if ($id === null) {
                throw SkillMissing::forNumber(
                    (int) $numberOrKey,
                );
            }

            return Skill::query()->whereKey($id)->firstOrFail();
        }

        $key = SkillKey::from($numberOrKey);
        $stored = Skill::query()->where('key', $key->key)->first();

        if ($stored !== null) {
            return $stored;
        }

        if ($this->skills->find($key)->origin === SkillOrigin::Shipped) {
            throw ShippedSkillReadOnly::for($key->key);
        }

        throw SkillMissing::for($key);
    }

    /**
     * The body a --body option names: its text, or standard input when it is -.
     */
    public function bodyOf(string $body): string
    {
        if ($body === '-') {
            return (string) file_get_contents('php://stdin');
        }

        return $body;
    }

    /**
     * A Markdown body as sections: one per heading at its top level, or one Instructions section when it has none.
     *
     * @return list<SectionDraft>
     */
    public function sectionsOf(string $body): array
    {
        $text = MarkdownText::body($body);
        $headings = array_values(array_filter($text->sections, fn ($section) => $section->level > 0));

        if ($headings === []) {
            return [new SectionDraft('instructions', 'Instructions', trim($text->text, "\n"))];
        }

        $top = min(array_map(fn ($section) => $section->level, $headings));

        return array_values(array_map(
            fn ($section) => new SectionDraft(
                Str::slug($section->heading),
                $section->heading,
                trim(
                    $section->lastLine > $section->firstLine ? $text->lines(
                        $section->firstLine + 1,
                        $section->lastLine,
                    ) : '',
                    "\n",
                ),
            ),
            array_filter($headings, fn ($section) => $section->level === $top),
        ));
    }

    /**
     * The condition JSON a command names: --conditions as written, or the audience and ability flags as one all
     * group, or empty for Everyone. Mixing the two, or a flag without a value, is refused.
     *
     * @param  array<string, list<string>>  $audience  each flag's values, by condition type
     *
     * @throws SkillConditionInvalid
     */
    public function conditionOf(string|null $conditions, array $audience): string
    {
        $named = array_filter($audience, fn (array $audienceMembers) => $audienceMembers !== []);

        if ($conditions !== null && $named !== []) {
            throw SkillConditionInvalid::field(
                '--conditions',
                'cannot be mixed with audience flags; use one or the other',
            );
        }

        foreach ($audience as $type => $audienceMembers) {
            if (in_array('', $audienceMembers, true)) {
                throw SkillConditionInvalid::field("--{$type}", 'needs a value');
            }
        }

        if ($conditions !== null) {
            return $conditions;
        }

        $children = [];

        foreach ($named as $type => $audienceMembers) {
            $children[] = ['type' => $type, 'version' => 1, 'keys' => array_values(array_unique($audienceMembers))];
        }

        if ($children === []) {
            return '';
        }

        return json_encode(
            ['type' => 'all', 'version' => 1, 'children' => $children],
            JSON_THROW_ON_ERROR,
        );
    }

    /**
     * The lines a save prints: the revision saved and that publication is pending, never that an agent loaded it.
     *
     * @return list<string>
     */
    public function savedLines(SkillRevisionResult $revision): array
    {
        $skill = Skill::query()->whereKey($revision->skillId)->firstOrFail();

        return [
            "Skill {$revision->number} ({$skill->key}): revision {$revision->revision} saved;"
            .' publication pending.',
            ...$this->statusLines($skill),
        ];
    }

    /**
     * What a write answers over MCP: the request id, the saved revision and the skill's status.
     *
     * @return array<string, mixed>
     */
    public function receipt(SkillRevisionResult $savedRevision, string $requestId): array
    {
        $skill = Skill::query()->whereKey($savedRevision->skillId)->firstOrFail();

        return SkillWriteReceipt::from([
            'requestId' => $requestId,
            'skillId' => $savedRevision->skillId,
            'number' => $savedRevision->number,
            'key' => $skill->key,
            'revision' => $savedRevision->revision,
            'status' => $this->statusLines($skill),
        ])->toArray();
    }

    /**
     * Source, current revision, targets, availability and delivery, each on its own line.
     *
     * @return list<string>
     */
    public function statusLines(Skill $skill): array
    {
        $current = SkillRevision::currentOf($skill);

        return [
            'Source: stored',
            "Current revision: {$current->revision}",
            'Targets: '.json_encode($current->condition, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES),
            'Availability: '.($skill->isRetired() ? 'retired' : 'available'),
            'Delivery: not yet delivered to any agent',
        ];
    }

    /**
     * The current revision of a stored skill as a draft, the starting point of an edit.
     */
    public function currentDraft(Skill $skill): SkillDraft
    {
        return SkillRevision::currentOf($skill)->draft;
    }

    /**
     * One numbered revision of a stored skill, as a reader shows it.
     */
    public function revisionView(Skill $skill, int $number): SkillRevisionView
    {
        $revision = SkillRevision::numbered($skill, $number);

        return SkillRevisionView::from([
            'revision' => $revision->revision,
            'name' => $revision->name,
            'description' => $revision->description,
            'condition' => $revision->condition,
            'sections' => array_map(
                fn (SkillSection $section) => [
                    'key' => $section->key,
                    'heading' => $section->heading,
                    'markdown' => $section->storedText(),
                ],
                $revision->sections,
            ),
        ]);
    }

    /**
     * The latest revisions of a stored skill, newest first, as a history shows them.
     *
     * @return list<SkillRevisionRow>
     */
    public function historyRows(Skill $skill, int $rows): array
    {
        return array_map(fn (SkillRevision $revision) => new SkillRevisionRow(
            revision: $revision->revision,
            name: $revision->name,
            author: "{$revision->author_type->value}:{$revision->author_id}",
            copiedFrom: $revision->source_key,
            savedAt: $revision->created_at->toIso8601String(),
        ), SkillRevision::historyOf($skill, $rows));
    }
}
