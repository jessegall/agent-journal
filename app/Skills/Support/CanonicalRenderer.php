<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Skills\Contracts\Skill;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Values\RenderedSkill;
use App\Skills\Values\SkillKey;
use App\Skills\Values\SkillOwner;
use App\Skills\Values\SkillSection;
use Symfony\Component\Yaml\Yaml;

/**
 * Renders a skill to one canonical Markdown text: YAML front matter with its key and description, its name as the
 * title, then each section's heading and body in declared order, with LF line ends and one final newline. Every check
 * runs before any text is returned.
 */
final readonly class CanonicalRenderer
{
    private const int MOST_SECTIONS = 64;

    private const int MOST_DESCRIPTION_BYTES = 1_024;

    private const int MOST_BYTES = 262_144;

    public function __construct(
        private MarkdownParts $parts,
    ) {}

    public function render(Skill $skill, SkillOwner $owner): RenderedSkill
    {
        $key = SkillKey::from($skill->key());
        $sections = $skill->sections()->resolve($this->parts, $owner, $skill->name());
        $this->checkSections($key, $sections);
        $this->assertValidDescription($key, $skill->description());

        $frontMatter = rtrim(Yaml::dump(['name' => $key->key, 'description' => $skill->description()]), "\n");

        $body = implode('', array_map(fn (SkillSection $section) => <<<SECTION


            ## {$section->heading}

            {$this->bodyOf($section, $owner)}
            SECTION, $sections));

        $page = <<<MARKDOWN
            ---
            {$frontMatter}
            ---

            # {$skill->name()}{$body}
            MARKDOWN;

        $markdown = rtrim(str_replace(["\r\n", "\r"], "\n", $page), "\n")."\n";

        if (! mb_check_encoding($markdown, 'UTF-8')) {
            throw SkillDeclarationInvalid::encoding($key->key);
        }

        if (strlen($markdown) > self::MOST_BYTES) {
            throw SkillDeclarationInvalid::tooLarge($key->key, self::MOST_BYTES);
        }

        return new RenderedSkill($key, $markdown, hash('sha256', $markdown));
    }

    /**
     * @param  list<SkillSection>  $sections
     */
    private function checkSections(SkillKey $key, array $sections): void
    {
        if ($sections === [] || count($sections) > self::MOST_SECTIONS) {
            throw SkillDeclarationInvalid::sectionCount($key->key, count($sections), self::MOST_SECTIONS);
        }

        $seen = [];

        foreach ($sections as $section) {
            if (in_array($section->key, $seen, true)) {
                throw SkillDeclarationInvalid::sectionKeyTwice($key->key, $section->key);
            }

            $seen[] = $section->key;
        }
    }

    private function assertValidDescription(SkillKey $key, string $description): void
    {
        if (! mb_check_encoding($description, 'UTF-8')) {
            throw SkillDeclarationInvalid::encoding($key->key);
        }

        if ($description === '' || strlen($description) > self::MOST_DESCRIPTION_BYTES) {
            throw SkillDeclarationInvalid::descriptionLength($key->key, self::MOST_DESCRIPTION_BYTES);
        }
    }

    private function bodyOf(SkillSection $section, SkillOwner $owner): string
    {
        return trim(str_replace(["\r\n", "\r"], "\n", $section->body($this->parts, $owner)), "\n");
    }
}
