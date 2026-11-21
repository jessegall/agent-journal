<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Files\Contracts\Files;
use App\Files\Exceptions\FileMissing;
use App\Files\Exceptions\FileOutsidePlaces;
use App\Files\Exceptions\FilePathInvalid;
use App\Files\Exceptions\FileUnreadable;
use App\Files\Exceptions\FolderClosed;
use App\Files\Exceptions\FolderMissing;
use App\Files\Exceptions\LinkLeavesPlace;
use App\Files\Exceptions\LinkLoop;
use App\Skills\Exceptions\SkillSourceInvalid;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillOwner;
use App\Skills\Values\SkillSection;
use App\Text\Exceptions\ContentMissing;
use App\Text\Exceptions\ContentTooLarge;
use App\Text\Exceptions\MarkdownInvalid;
use App\Text\Support\MarkdownText;
use App\Text\Support\Section;
use Illuminate\Support\Str;

/**
 * Reads Markdown parts and assets from an owner's resources/skills folder, and nowhere else: no absolute path, no
 * parent step, no URL and no symlink that leaves the folder. A part is taken as written; it includes nothing itself.
 */
final readonly class MarkdownParts
{
    public function __construct(private Files $files) {}

    /**
     * The part's Markdown: the whole body without its front matter, or the subtree under its heading path without
     * that heading.
     *
     * @throws SkillSourceInvalid
     */
    public function read(MarkdownPart $part, SkillOwner $owner): string
    {
        $markdown = $this->markdownOf($part->file, $owner);

        if ($part->isWholeBody()) {
            return trim($markdown->text, "\n");
        }

        $sections = $markdown->sectionsAtPath($part->headingPath);

        return match (count($sections)) {
            0 => throw SkillSourceInvalid::missingHeading($part->selector()),
            1 => trim($this->bodyUnderHeading($markdown, $sections[0]->firstLine, $sections[0]->lastLine), "\n"),
            default => throw SkillSourceInvalid::repeatedHeading($part->selector()),
        };
    }

    /**
     * The sections of a skill file: the text under its # title as the purpose, then one section per ## heading, keyed
     * by the heading in kebab case. The # title must be the skill's name.
     *
     * @return list<SkillSection>
     *
     * @throws SkillSourceInvalid
     */
    public function sectionsOf(string $file, SkillOwner $owner, string $name): array
    {
        $markdown = $this->markdownOf($file, $owner);
        $title = $this->titleOf($markdown, $file, $name);
        $headings = array_values(array_filter($markdown->sections, fn (Section $section) => $section->level === 2));
        $purposeEnd = isset($headings[0]) ? $headings[0]->firstLine - 1 : $title->lastLine;
        $purpose = trim($this->bodyUnderHeading($markdown, $title->firstLine, $purposeEnd), "\n");
        $sections = $purpose === '' ? [] : [SkillSection::text('purpose', 'Purpose', $purpose)];

        foreach ($headings as $heading) {
            $key = Str::slug($heading->heading);

            if ($key === '') {
                throw SkillSourceInvalid::headingWithoutKey($file, $heading->heading);
            }

            $sections[] = SkillSection::markdown(
                $key,
                $heading->heading,
                MarkdownPart::heading($file, [$name, $heading->heading]),
            );
        }

        return $sections;
    }

    /**
     * The file's one # title, which stands first in the file and is the skill's name.
     *
     * @throws SkillSourceInvalid
     */
    private function titleOf(MarkdownText $markdown, string $file, string $name): Section
    {
        $outline = array_values(array_filter($markdown->sections, fn (Section $section) => $section->level > 0));
        $title = $outline[0] ?? null;
        $textBeforeTitle = array_filter(
            $markdown->sections,
            fn (Section $section) => $section->level === 0 && trim(
                $markdown->lines($section->firstLine, $section->lastLine),
            ) !== '',
        );

        if ($title === null || $title->level !== 1 || $textBeforeTitle !== []) {
            throw SkillSourceInvalid::missingTitle($file);
        }

        $secondTitle = array_find(array_slice($outline, 1), fn (Section $heading) => $heading->level === 1);

        if ($secondTitle !== null) {
            throw SkillSourceInvalid::secondTitle($file, $secondTitle->heading);
        }

        return $title->heading === $name ? $title : throw SkillSourceInvalid::titleDiffers(
            $file,
            $title->heading,
            $name,
        );
    }

    /**
     * @throws SkillSourceInvalid
     */
    private function markdownOf(string $file, SkillOwner $owner): MarkdownText
    {
        $text = $this->sourceOf($file, $owner);

        try {
            return MarkdownText::body($this->withoutFrontMatter(str_replace(["\r\n", "\r"], "\n", $text)));
        } catch (MarkdownInvalid|ContentMissing|ContentTooLarge $refusal) {
            throw SkillSourceInvalid::unreadable($file, $refusal);
        }
    }

    /**
     * The text of a skill source inside its owner's resources/skills folder, read through the funnel, which refuses a
     * path that climbs out and a link that leaves the place; each refusal is told as the skill's own.
     *
     * @throws SkillSourceInvalid
     */
    private function sourceOf(string $file, SkillOwner $owner): string
    {
        try {
            return $this->files->read($this->files->filePathOf($owner->skillsFolder())->child($file));
        } catch (FilePathInvalid|FileOutsidePlaces|FolderClosed|LinkLeavesPlace) {
            throw SkillSourceInvalid::outsideFolder($file);
        } catch (FileMissing|FolderMissing|LinkLoop) {
            throw SkillSourceInvalid::missingFile($file);
        } catch (FileUnreadable $refusal) {
            throw SkillSourceInvalid::unreadable($file, $refusal);
        }
    }

    private function withoutFrontMatter(string $text): string
    {
        return (string) preg_replace('/\A---\n.*?\n---\n/s', '', $text, 1);
    }

    /**
     * The lines of a section below its heading line, and below a setext underline when the heading has one.
     */
    private function bodyUnderHeading(MarkdownText $markdown, int $firstLine, int $lastLine): string
    {
        $next = $firstLine + 1;
        $underlined = $next <= $lastLine && preg_match('/^ {0,3}(=+|-+)\s*$/', $markdown->lines($next, $next)) === 1;
        $start = $underlined ? $next + 1 : $next;

        return $start > $lastLine ? '' : $markdown->lines($start, $lastLine);
    }
}
