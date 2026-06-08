"""
Test runner for all services in the services directory.
Executes the main blocks from db.py, llm.py, and tavily_client.py
"""

import sys
import subprocess
from pathlib import Path


def run_service_tests():
    """Run all service tests by executing their __main__ blocks"""
    
    services_dir = Path(__file__).parent
    service_files = ["db.py", "llm.py", "tavily_client.py"]
    
    print("=" * 60)
    print("Running Service Connection Tests")
    print("=" * 60)
    
    results = {}
    
    for service_file in service_files:
        service_path = services_dir / service_file
        
        if not service_path.exists():
            print(f"\n❌ {service_file}: File not found")
            results[service_file] = "NOT_FOUND"
            continue
        
        print(f"\n{'─' * 60}")
        print(f"Testing: {service_file}")
        print(f"{'─' * 60}")
        
        try:
            # Run the service file as a subprocess to execute its __main__ block
            result = subprocess.run(
                [sys.executable, str(service_path)],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            # Print output
            if result.stdout:
                print(result.stdout)
            if result.stderr:
                print("STDERR:", result.stderr)
            
            # Record result
            results[service_file] = "PASSED" if result.returncode == 0 else "FAILED"
            
        except subprocess.TimeoutExpired:
            print(f"❌ {service_file}: Test timed out")
            results[service_file] = "TIMEOUT"
        except Exception as e:
            print(f"❌ {service_file}: Error running test - {e}")
            results[service_file] = "ERROR"
    
    # Print summary
    print(f"\n{'=' * 60}")
    print("Test Summary")
    print(f"{'=' * 60}")
    
    for service, status in results.items():
        status_symbol = "✓" if status == "PASSED" else "✗"
        print(f"{status_symbol} {service}: {status}")
    
    print("=" * 60)


if __name__ == "__main__":
    run_service_tests()
