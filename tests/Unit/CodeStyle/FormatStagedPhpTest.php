<?php

declare(strict_types=1);

namespace Tests\Unit\CodeStyle;

use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;
use Tests\TestCase;

/**
 * scripts/format-staged-php.sh, which the pre-commit hook runs: a staged PHP file is committed formatted, and a file
 * that is not staged is left as it is.
 */
final class FormatStagedPhpTest extends TestCase
{
    private const string UNFORMATTED = "<?php\n\ndeclare(strict_types=1);\n\n\$total=1+2;\n";

    private const string FORMATTED = "<?php\n\ndeclare(strict_types=1);\n\n\$total = 1 + 2;\n";

    private string $checkout;

    protected function setUp(): void
    {
        parent::setUp();

        $this->checkout = sys_get_temp_dir().'/format-staged-'.bin2hex(random_bytes(6));
        File::ensureDirectoryExists("{$this->checkout}/scripts");
        File::ensureDirectoryExists("{$this->checkout}/app");
        File::ensureDirectoryExists("{$this->checkout}/domain");
        File::ensureDirectoryExists("{$this->checkout}/storage/framework/cache");
        File::copy(base_path('scripts/format-staged-php.sh'), "{$this->checkout}/scripts/format-staged-php.sh");
        File::copy(base_path('pint.json'), "{$this->checkout}/pint.json");
        File::copyDirectory(base_path('tools/code-style'), "{$this->checkout}/tools/code-style");
        File::link(base_path('vendor'), "{$this->checkout}/vendor");
        $this->runInCheckout('git', 'init', '--quiet');
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->checkout);

        parent::tearDown();
    }

    public function test_a_staged_php_file_is_formatted_and_staged_again(): void
    {
        File::put("{$this->checkout}/app/Sum.php", self::UNFORMATTED);
        $this->runInCheckout('git', 'add', 'app/Sum.php');

        $this->runInCheckout('sh', 'scripts/format-staged-php.sh');

        $this->assertSame(self::FORMATTED, $this->runInCheckout('git', 'show', ':app/Sum.php'));
        $this->assertSame(self::FORMATTED, File::get("{$this->checkout}/app/Sum.php"));
    }

    public function test_a_php_file_that_is_not_staged_is_left_alone(): void
    {
        File::put("{$this->checkout}/app/Sum.php", self::UNFORMATTED);

        $this->runInCheckout('sh', 'scripts/format-staged-php.sh');

        $this->assertSame(self::UNFORMATTED, File::get("{$this->checkout}/app/Sum.php"));
    }

    private function runInCheckout(string ...$command): string
    {
        return new Process($command, $this->checkout)->mustRun()->getOutput();
    }
}
