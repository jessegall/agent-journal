package classify

import "testing"

const (
	testRun = testRunCategory
	build   = "build"
	check   = "check"
)

// The forms of report 1181, each with the category its source gives it.
var reportForms = map[string]string{
	"cabal test":         testRun,
	"cabal bench":        testRun,
	"cabal build":        build,
	"stack test":         testRun,
	"stack build --test": testRun,
	"stack build":        build,
	"dune test":          testRun,
	"dune runtest":       testRun,
	"dune build":         build,
	"meson test --list":  testRun,
	"meson compile":      build,
	"lein test":          testRun,
	"lein test :only my-stuff.core-test/a-test": testRun,
	"lein uberjar":                                    build,
	"zig build test --summary all":                    testRun,
	"zig test foo.zig":                                testRun,
	"zig build":                                       build,
	"./mvnw test":                                     testRun,
	"./mvnw package":                                  build,
	"./gradlew test":                                  testRun,
	"./gradlew assembleStaging":                       build,
	"./gradlew connectedAndroidTest":                  testRun,
	"./gradlew connectedCheck":                        testRun,
	"./gradlew testDebugUnitTest":                     testRun,
	"./gradlew connectedDebugAndroidTest":             testRun,
	"./gradlew mylibrary:connectedAndroidTest":        testRun,
	"./gradlew :module_name:testAllSuites --continue": testRun,
	"gradle :app:test":                                testRun,
	"node --test":                                     testRun,
	"node --test --watch":                             testRun,
	"ng test":                                         testRun,
	"ng e2e":                                          testRun,
	"ng build":                                        build,
	"ng lint":                                         check,
	"hatch test --cover":                              testRun,
	"buck2 test //foo:bar":                            testRun,
	"buck2 build //foo:bar":                           build,
	"pants test project::":                            testRun,
	"pants package ::":                                build,
	"scala-cli test MyTests.test.scala":               testRun,
	"fastlane scan":                                   testRun,
	"ginkgo":                                          testRun,
	"crystal spec":                                    testRun,
	"crystal build src/main.cr":                       build,
	"dub test":                                        testRun,
	"dub build":                                       build,
	"dub lint":                                        check,
	"prove -v t/mytest.t":                             testRun,
	"busted test.lua":                                 testRun,
	"raco test tests.rkt":                             testRun,
	"raco make main.rkt":                              build,
	"pio test --filter test_common":                   testRun,
	"pio run -e uno":                                  build,
	"platformio test":                                 testRun,
	"roc test":                                        testRun,
	"roc check":                                       check,
	"adb shell am instrument -w com.android.example/androidx.test.runner.AndroidJUnitRunner": testRun,
	"Unity -runTests -batchmode -projectPath game":                                           testRun,
	"turbo run build":                              build,
	"turbo build --filter=@acme/web":               build,
	"turbo run test":                               testRun,
	"nx build my-app":                              build,
	"npx nx run-many -t build lint test -p header": build,
	"moon run :test":                               testRun,
	"moon run app:lint":                            check,
	"mage deploy":                                  build,
	"next build":                                   build,
	"npx next build":                               build,
	"xmake":                                        build,
	"scons":                                        build,
	"waf configure":                                build,
	"ant -buildfile test.xml dist":                 build,
	"bazelisk --strict build //...":                build,
	"bazelisk test //foo:bar_test":                 testRun,
	"gn gen out/my_build":                          build,
	"west build -b reel_board samples/hello_world": build,
	"idf.py -j 6 build":                            build,
	"dbt build":                                    build,
	"dbt run":                                      build,
	"dbt test":                                     testRun,
	"dbt compile":                                  build,
	"packer build template.pkr.hcl":                build,
	"packer validate template.pkr.hcl":             check,
	"docker buildx bake":                           build,
	"docker buildx build .":                        build,
	"nimble build --useSystemNim":                  build,
	"godot --headless --export-release Linux game": build,
	"godot --check-only --script a.gd":             check,
	"RunUAT.sh BuildCookRun -project=My.uproject":  build,
	"dotnet pack":                                  build,
	"dotnet clean":                                 build,
	"dotnet msbuild":                               build,
	"dotnet vstest a.dll":                          testRun,
	"deno check main.ts":                           check,
	"deno lint":                                    check,
	"deno fmt":                                     check,
	"deno bench":                                   testRun,
	"terraform validate":                           check,
	"terraform fmt":                                check,
	"helm lint chart":                              check,
	"helm template chart":                          check,
	"helm test release":                            testRun,
	"helm package chart":                           build,
	"nix flake check":                              check,
	"uv build":                                     build,
	"cargo bench":                                  testRun,
	"cargo doc":                                    build,
	"pre-commit run --all-files":                   check,
}

func TestEachFormOfTheReportHasItsCategory(t *testing.T) {
	for text, category := range reportForms {
		if actual := shippedClassifier.Classify(text).Category; actual != category {
			t.Errorf("%q: %s, want %s", text, actual, category)
		}
	}
}

func TestATaskNameAfterAColonNamesTheSubcommand(t *testing.T) {
	if actual := shippedClassifier.Classify("npm run unit:test").Category; actual != testRun {
		t.Errorf("npm run unit:test: %s", actual)
	}
}
