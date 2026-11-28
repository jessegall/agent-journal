<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use Illuminate\Support\Facades\File;
use Symfony\Component\Finder\SplFileInfo;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * No recording holds a macOS home folder, in plain text or in a base64 body: recordings run in containers, so a home
 * folder of the Mac is its owner's name leaking from a run made on the machine itself.
 */
#[TimeLimit(seconds: 30, reason: 'It reads every recording and decodes each of its bodies.')]
final class RecordedHomePathsTest extends TestCase
{
    private const string HOME_FOLDER = '#(?:/|\\\\/|-)Users(?:/|\\\\/|-)[A-Za-z0-9._]+#';

    private const string BASE64_BODY = '#"((?:[A-Za-z0-9+/]{4}){6,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)"#';

    public function test_no_recording_holds_a_home_folder_of_the_mac(): void
    {
        $found = [];

        foreach (File::allFiles(resource_path('recordings')) as $file) {
            if ($this->holdsHomeFolder($file)) {
                $found[] = $file->getRelativePathname();
            }
        }

        $this->assertSame([], $found);
    }

    private function holdsHomeFolder(SplFileInfo $file): bool
    {
        $text = $file->getContents();

        if (preg_match(self::HOME_FOLDER, $text) === 1) {
            return true;
        }

        preg_match_all(self::BASE64_BODY, $text, $bodies);

        return array_any(
            $bodies[1],
            fn (string $body) => preg_match(self::HOME_FOLDER, (string) base64_decode($body, true)) === 1,
        );
    }
}
