<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * A model or an enum sits in the folder of its subject, such as app/Models/Messages/Message.php or
 * app/Enums/Accounts/AccountState.php, never directly in app/Models or app/Enums (user message 22317).
 */
final class SubjectFoldersTest extends TestCase
{
    /**
     * @return array<string, array{string}>
     */
    public static function folders(): array
    {
        return [
            'models' => ['Models'],
            'enums' => ['Enums'],
        ];
    }

    #[DataProvider('folders')]
    public function test_nothing_sits_directly_in_the_folder(string $folder): void
    {
        $loose = array_map(basename(...), glob(app_path("{$folder}/*.php")) ?: []);

        $this->assertSame([], $loose);
    }
}
