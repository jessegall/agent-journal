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
        $this->assertStringContainsString('Expires {{ date }} (', $check->output());
        $this->assertStringContainsString('Account state (', $check->output());
        $this->assertStringContainsString('Sign in again (', $check->output());
        $this->assertStringNotContainsString('{{ count }} (', $check->output());
    }

    public function test_the_check_passes_once_the_texts_are_accepted(): void
    {
        $this->texts('--accept');

        $check = $this->texts('--check');

        $this->assertSame(0, $check->exitCode());
        $this->assertStringContainsString('All 3 screen texts were reviewed.', $check->output());
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
