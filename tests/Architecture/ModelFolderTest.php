<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\TestCase;

/**
 * A model sits in the folder of its subject, such as app/Models/Messages/Message.php, never directly in
 * app/Models.
 */
final class ModelFolderTest extends TestCase
{
    public function test_no_model_sits_directly_in_the_models_folder(): void
    {
        $loose = array_map(basename(...), glob(app_path('Models/*.php')) ?: []);

        $this->assertSame([], $loose);
    }
}
