<?php

declare(strict_types=1);

namespace App\Support;

use App\Attributes\OutsideThePlaces;
use App\Data\Images\PackageFileData;
use App\Enums\PlaceExemption;
use App\Values\ScriptBinding;
use App\Values\ScriptBody;
use App\Values\Word;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * Finds the package script a composer, npm or pnpm command runs in the trusted
 * project root's composer.json or package.json, with the digest of its body. A script name is never a class by
 * itself: the classifier reads the body line by line.
 */
final readonly class PackageScripts
{
    private const array PACKAGE_FILES = [
        'composer' => 'composer.json',
        'npm' => 'package.json',
        'pnpm' => 'package.json',
    ];

    /**
     * Composer callbacks that only adjust Composer itself and run nothing.
     */
    private const array HARMLESS_CALLBACKS = ['Composer\\Config::disableProcessTimeout'];

    /**
     * The script the words run, or none when they run no script of the project.
     *
     * @param  list<Word>  $words  the command's words, the program first
     * @return list<ScriptBody>
     */
    public function scriptOf(string $manager, array $words, string $projectRoot): array
    {
        if (! isset(self::PACKAGE_FILES[$manager])) {
            return [];
        }

        $texts = array_map(fn (Word $word): string => (string) $word->literal(), array_slice($words, 1, 2));
        $first = $texts[0] ?? '';

        $name = match (true) {
            in_array($first, ['run', 'run-script'], true) => $texts[1] ?? '',
            $first === 'test' && $manager !== 'composer' => 'test',
            $manager === 'composer' => $first,
            default => '',
        };

        return $name === '' ? [] : $this->bodyOf($manager, $name, $projectRoot);
    }

    /**
     * @return list<ScriptBody>
     */
    #[OutsideThePlaces(PlaceExemption::CommandFileSystem)]
    public function bodyOf(string $manager, string $name, string $projectRoot): array
    {
        $file = self::PACKAGE_FILES[$manager];
        $path = rtrim($projectRoot, '/')."/{$file}";
        $lines = is_file($path) ? self::packageOf((string) file_get_contents($path))->linesOf($name) : [];

        if ($lines === []) {
            return [];
        }

        return [
            new ScriptBody(
                new ScriptBinding($file, $name, hash('sha256', json_encode($lines, JSON_THROW_ON_ERROR))),
                $lines,
            ),
        ];
    }

    public function isHarmlessCallback(string $line): bool
    {
        return in_array($line, self::HARMLESS_CALLBACKS, true);
    }

    /**
     * The package file its text reads as, with no scripts when it is not a JSON object of that shape.
     */
    private static function packageOf(string $text): PackageFileData
    {
        try {
            return PackageFileData::from(json_decode($text, true, 512, JSON_THROW_ON_ERROR));
        } catch (JsonException|CannotCreateData|TypeError) {
            return new PackageFileData();
        }
    }
}
