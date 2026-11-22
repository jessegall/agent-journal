<?php

declare(strict_types=1);

namespace Tests\Unit\Tools;

use Illuminate\Contracts\Process\ProcessResult;
use Illuminate\Support\Facades\Process;
use Tests\TestCase;

/**
 * The texts check: it names a screen text nobody reviewed yet, and passes once the reviewed list records it.
 */
final class ScreenTextListTest extends TestCase
{
    private const string EXPIRY_TEXT = 'Expires {{ date }}';

    private const string ACCOUNT_STATE_TEXT = 'Account state';

    private const string SIGN_IN_TEXT = 'Sign in again';

    private const string COUNT_TEXT = '{{ count }}';

    private const string ALL_REVIEWED_TEXT = 'All 3 screen texts were reviewed.';

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/screen-texts-'.bin2hex(random_bytes(4));
        mkdir($this->folder);
        file_put_contents($this->folder.'/AccountRow.vue', <<<'VUE'
            <script setup lang="ts">
            const action = { label: 'Sign in again' };
            </script>

            <template>
                <p title="Account state">Expires {{ date }}</p>
                <span>{{ count }}</span>
            </template>
            VUE);
    }

    protected function tearDown(): void
    {
        array_map('unlink', glob($this->folder.'/*') ?: []);
        rmdir($this->folder);

        parent::tearDown();
    }

    public function test_the_check_names_each_text_not_reviewed_yet(): void
    {
        $check = $this->texts('--check');

        $this->assertSame(1, $check->exitCode());
        $this->assertStringContainsString($this->listed(self::EXPIRY_TEXT), $check->output());
        $this->assertStringContainsString($this->listed(self::ACCOUNT_STATE_TEXT), $check->output());
        $this->assertStringContainsString($this->listed(self::SIGN_IN_TEXT), $check->output());
        $this->assertStringNotContainsString($this->listed(self::COUNT_TEXT), $check->output());
    }

    public function test_the_check_passes_once_the_texts_are_accepted(): void
    {
        $this->texts('--accept');

        $check = $this->texts('--check');

        $this->assertSame(0, $check->exitCode());
        $this->assertStringContainsString(self::ALL_REVIEWED_TEXT, $check->output());
    }

    private function listed(string $text): string
    {
        return "{$text} (";
    }

    private function texts(string $mode): ProcessResult
    {
        return Process::run([
            PHP_BINARY,
            base_path('tools/refactoring/list-texts.php'),
            $mode,
            $this->folder.'/reviewed-texts.txt',
            $this->folder,
        ]);
    }
}
