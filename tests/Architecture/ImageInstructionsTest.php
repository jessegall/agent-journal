<?php

declare(strict_types=1);

namespace Tests\Architecture;

/**
 * An agent's instructions, skills and settings are handed to its container by the host at every boot, never built
 * into an image, so a change to them reaches the next session without an image build: an image holds programs and
 * packages only, never a configuration file.
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

    /**
     * A COPY or ADD of a configuration file: settings, JSON, TOML, YAML, INI or environment files. The package lists an
     * install reads (composer.json, package.json and their locks) are what the image's packages come from, not settings.
     */
    private const string CONFIGURATION_COPY = '~^\s*(?:COPY|ADD)\b(?!.*\b(?:composer|package(?:-lock)?)\.(?:json|lock)\b).*'
        .'(?:\.json|\.toml|\.ya?ml|\.ini|\.conf|\.env|settings)\b~mi';

    public function test_no_image_build_copies_an_agents_instructions_or_skills(): void
    {
        $this->assertSame([], $this->linesMatching(self::INSTRUCTION_COPY));
    }

    public function test_no_image_build_copies_a_configuration_file(): void
    {
        $this->assertSame([], $this->linesMatching(self::CONFIGURATION_COPY));
    }

    public function test_the_package_lists_an_install_reads_pass(): void
    {
        $this->assertSame(0, preg_match(self::CONFIGURATION_COPY, 'COPY package.json package-lock.json ./'));
    }

    public function test_a_copied_settings_file_is_caught(): void
    {
        $this->assertSame(1, preg_match(
            self::CONFIGURATION_COPY,
            'COPY resources/agents/claude-code-managed-settings.json /etc/claude-code/managed-settings.json',
        ));
    }

    /**
     * @return list<string>
     */
    private function linesMatching(string $pattern): array
    {
        $found = [];

        foreach (self::BUILD_FILES as $file) {
            foreach (explode("\n", (string) file_get_contents(base_path($file))) as $index => $line) {
                if (preg_match($pattern, $line) === 1) {
                    $found[] = $file.':'.($index + 1);
                }
            }
        }

        return $found;
    }

    public function test_a_copied_skill_is_caught(): void
    {
        $this->assertSame(1, preg_match(self::INSTRUCTION_COPY, 'COPY resources/skills/journal/SKILL.md /opt/skills/'));
    }
}
