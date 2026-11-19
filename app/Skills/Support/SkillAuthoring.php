<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Actors\Exceptions\ConsoleOwnerMissing;
use App\Bus\Support\ConsoleOwner;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Data\SkillWriteReceipt;
use App\Skills\Enums\SkillOrigin;
use App\Skills\Exceptions\ShippedSkillReadOnly;
use App\Skills\Exceptions\SkillConditionInvalid;
use App\Skills\Exceptions\SkillMissing;
use App\Skills\Models\Skill;
use App\Skills\Models\SkillRevision;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillKey;
use App\Skills\Values\SkillRevisionResult;
use App\Skills\Values\SkillSection;
use App\Text\Support\MarkdownText;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\Str;

/**
 * What every skill authoring entry point shares, on the command line and over MCP: acting as the journal owner on
 * the command line, finding a stored skill by number or key,
 * turning a Markdown body and audience flags into a draft, and the plain lines a save prints.
 */
final readonly class SkillAuthoring
{
    public function __construct(
        private ConsoleOwner $console,
        private Container $container,
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
    public function stored(string $numberOrKey): Skill
    {
        if (ctype_digit($numberOrKey)) {
            $id = Skill::idOfNumber((int) $numberOrKey);

            return $id === null ? throw SkillMissing::forNumber(
                (int) $numberOrKey,
            ) : Skill::query()->whereKey($id)->firstOrFail();
        }

        $key = SkillKey::from($numberOrKey);
        $stored = Skill::query()->where('key', $key->key)->first();

        if ($stored !== null) {
            return $stored;
        }

        return $this->container->make(
            SkillResolver::class,
        )->find($key)->origin === SkillOrigin::Shipped ? throw ShippedSkillReadOnly::for($key->key) : throw SkillMissing::for($key);
    }

    /**
     * The body a --body option names: its text, or standard input when it is -.
     */
    public function bodyOf(string $body): string
    {
        return $body === '-' ? (string) file_get_contents('php://stdin') : $body;
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
        $named = array_filter($audience, fn (array $values) => $values !== []);

        if ($conditions !== null && $named !== []) {
            throw SkillConditionInvalid::field(
                '--conditions',
                'cannot be mixed with audience flags; use one or the other',
            );
        }

        foreach ($audience as $type => $values) {
            if (in_array('', $values, true)) {
                throw SkillConditionInvalid::field("--{$type}", 'needs a value');
            }
        }

        if ($conditions !== null) {
            return $conditions;
        }

        $children = [];

        foreach ($named as $type => $values) {
            $children[] = ['type' => $type, 'version' => 1, 'keys' => array_values(array_unique($values))];
        }

        return $children === [] ? '' : json_encode(
            ['type' => 'all', 'version' => 1, 'children' => $children],
            JSON_THROW_ON_ERROR,
        );
    }

    /**
     * The lines a save prints: the revision saved and that publication is pending, never that an agent loaded it.
     *
     * @return list<string>
     */
    public function savedLines(SkillRevisionResult $result): array
    {
        $skill = Skill::query()->whereKey($result->skillId)->firstOrFail();

        return [
            "Skill {$result->number} ({$skill->key}): revision {$result->revision} saved; publication pending.",
            ...$this->statusLines($skill),
        ];
    }

    /**
     * What a write answers over MCP: the request id, the saved revision and the skill's status.
     *
     * @return array<string, mixed>
     */
    public function receipt(SkillRevisionResult $result, string $requestId): array
    {
        $skill = Skill::query()->whereKey($result->skillId)->firstOrFail();

        return SkillWriteReceipt::from([
            'requestId' => $requestId,
            'skillId' => $result->skillId,
            'number' => $result->number,
            'key' => $skill->key,
            'revision' => $result->revision,
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
        return SkillRevision::currentOf($skill)->draft();
    }

    /**
     * One numbered revision of a stored skill, as the fields a reader shows.
     *
     * @return array{revision: int, name: string, description: string, condition: mixed, sections: list<array{key: string, heading: string, markdown: string}>}
     */
    public function revisionFields(Skill $skill, int $number): array
    {
        $revision = SkillRevision::numbered($skill, $number);

        return [
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
        ];
    }

    /**
     * The latest revisions of a stored skill, newest first, as the fields a history shows.
     *
     * @return list<array{revision: int, name: string, author: string, copied_from: string|null, saved_at: string}>
     */
    public function historyFields(Skill $skill, int $rows): array
    {
        return array_map(fn (SkillRevision $revision) => [
            'revision' => $revision->revision,
            'name' => $revision->name,
            'author' => "{$revision->author_type->value}:{$revision->author_id}",
            'copied_from' => $revision->source_key,
            'saved_at' => $revision->created_at->toIso8601String(),
        ], SkillRevision::historyOf($skill, $rows));
    }
}
