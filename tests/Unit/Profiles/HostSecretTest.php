<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Hosts\Exceptions\HostSecretUnreadable;
use App\Hosts\HostSecret;
use PHPUnit\Framework\TestCase;

final class HostSecretTest extends TestCase
{
    private string $folder = '';

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/host-secret-'.uniqid();
        mkdir($this->folder, 0o700);
    }

    protected function tearDown(): void
    {
        array_map(unlink(...), glob($this->folder.'/*') ?: []);
        rmdir($this->folder);

        parent::tearDown();
    }

    public function test_the_secret_comes_from_an_owner_only_file_without_its_trailing_newline(): void
    {
        $this->assertSame('s3cret', HostSecret::fromEnvironment($this->file("s3cret\n", 0o600), ''));
    }

    public function test_without_a_file_the_secret_comes_from_the_variable_as_before(): void
    {
        $this->assertSame('s3cret', HostSecret::fromEnvironment('', 's3cret'));
    }

    public function test_a_file_its_group_can_read_is_refused(): void
    {
        $this->expectExceptionObject(HostSecretUnreadable::tooOpen());

        HostSecret::fromEnvironment($this->file('s3cret', 0o640), '');
    }

    public function test_a_missing_or_empty_file_is_refused(): void
    {
        $this->expectExceptionObject(HostSecretUnreadable::missing());

        HostSecret::fromEnvironment($this->folder.'/none', '');
    }

    public function test_an_empty_file_is_refused(): void
    {
        $this->expectExceptionObject(HostSecretUnreadable::empty());

        HostSecret::fromEnvironment($this->file("\n", 0o600), '');
    }

    public function test_both_ways_at_once_are_refused(): void
    {
        $this->expectExceptionObject(HostSecretUnreadable::givenTwice());

        HostSecret::fromEnvironment($this->file('s3cret', 0o600), 's3cret');
    }

    private function file(string $content, int $mode): string
    {
        $path = $this->folder.'/secret-'.uniqid();
        file_put_contents($path, $content);
        chmod($path, $mode);

        return $path;
    }
}
