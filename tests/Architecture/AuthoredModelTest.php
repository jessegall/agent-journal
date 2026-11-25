<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\Records\AuthoredModel;
use App\Support\Reflector;
use Illuminate\Database\Eloquent\Model;
use Tests\Architecture\Support\DomainFiles;

/**
 * An AuthoredModel is always an Eloquent model: whatever implements it extends Model.
 */
final class AuthoredModelTest extends TestCase
{
    public function test_every_authored_model_is_an_eloquent_model(): void
    {
        $faults = [];

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode()]) as $file) {
            if (preg_match('/^namespace ([^;]+);/m', (string) file_get_contents($file), $namespace) !== 1) {
                continue;
            }

            $class = $namespace[1].'\\'.basename($file, '.php');

            if (Reflector::factory()->isSubclassOf($class, AuthoredModel::class)
                && ! Reflector::factory()->isSubclassOf($class, Model::class)) {
                $faults[] = $class;
            }
        }

        $this->assertSame([], $faults, 'Only a model implements AuthoredModel.');
    }
}
