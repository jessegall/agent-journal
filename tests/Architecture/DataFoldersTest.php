<?php

declare(strict_types=1);

namespace Tests\Architecture;

/**
 * Core's data classes sit in a folder of their subject under app/Data, such as app/Data/Messages, never loose in
 * app/Data itself; a domain's src/Data already is its subject.
 */
final class DataFoldersTest extends TestCase
{
    public function test_no_data_class_lies_loose_in_app_data(): void
    {
        $this->assertSame([], self::looseIn(app_path('Data')));
    }

    public function test_a_loose_data_class_is_pointed_out(): void
    {
        $this->assertSame(['LooseData.php'], self::looseIn(base_path('tests/Fixtures/DataFolders')));
    }

    /**
     * @return list<string>
     */
    private static function looseIn(string $folder): array
    {
        return array_map(basename(...), glob("{$folder}/*.php") ?: []);
    }
}
