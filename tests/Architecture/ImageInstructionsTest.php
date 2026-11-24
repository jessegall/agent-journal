<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\TestCase;

/**
 * An agent's instructions and skills are handed to its container by the host at every boot, never built into an
 * image, so a change to them reaches the next session without an image build.
 */
final class ImageInstructionsTest extends TestCase
{
    private const array BUILD_FILES = [
        '.docker/app/Dockerfile',
        '.docker/helper/Dockerfile',
        '.docker/helper/build.sh',
        '.docker/updater/Dockerfile',
        '.docker/web/Dockerfile',
    ];

    private const string INSTRUCTION_COPY = '~^\s*(?:COPY|ADD)\b.*'
        .'(?:SKILL\.md|CLAUDE\.md|AGENTS\.md|/skills\b|instructions)~mi';

    public function test_no_image_build_copies_an_agents_instructions_or_skills(): void
    {
        $found = [];

        foreach (self::BUILD_FILES as $file) {
            foreach (explode("\n", (string) file_get_contents(base_path($file))) as $index => $line) {
                if (preg_match(self::INSTRUCTION_COPY, $line) === 1) {
                    $found[] = $file.':'.($index + 1);
                }
            }
        }

        $this->assertSame([], $found);
    }

    public function test_a_copied_skill_is_caught(): void
    {
        $this->assertSame(1, preg_match(self::INSTRUCTION_COPY, 'COPY resources/skills/journal/SKILL.md /opt/skills/'));
    }
}
